const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");

// ================= CONFIG =================
const SALT_ROUNDS = 12;
const EMAIL_CHANGE_EXPIRY_MINUTES = 15;
const MIN_PASSWORD_LENGTH = 8;

// ================= HELPER: Generate Secure Token =================
const generateSecureToken = () => crypto.randomBytes(32).toString("hex");

// ================= HELPER: Hash Password =================
const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

// ================= HELPER: Standardized Response =================
const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

// ================= VALIDATION HELPERS =================
const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Must contain a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Must contain a special character");
  return errors;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -emailChangeToken -emailChangeExpires -resetPasswordToken -resetPasswordExpires")
      .lean();

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, { user }, "Profile retrieved successfully");
  } catch (error) {
    console.error("[GetProfile Error]:", error);
    return errorResponse(res, "Failed to retrieve profile", 500);
  }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email } = req.body;

    // Validation
    if (!name && !email) {
      return errorResponse(res, "At least one field (name or email) is required");
    }

    const updates = {};
    
    if (name !== undefined) {
      if (name.trim().length < 2) {
        return errorResponse(res, "Name must be at least 2 characters");
      }
      updates.name = name.trim();
    }

    // Email change requires verification — don't update directly
    if (email !== undefined) {
      return errorResponse(res, "Use the email change feature to update your email address", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, session, runValidators: true }
    ).select("-password -emailChangeToken -emailChangeExpires");

    if (!user) {
      await session.abortTransaction();
      return errorResponse(res, "User not found", 404);
    }

    await session.commitTransaction();

    return successResponse(res, { user }, "Profile updated successfully");
  } catch (error) {
    await session.abortTransaction();
    console.error("[UpdateProfile Error]:", error);
    
    if (error.name === "ValidationError") {
      return errorResponse(res, "Invalid input data", 400, Object.values(error.errors).map(e => e.message));
    }
    
    return errorResponse(res, "Failed to update profile", 500);
  } finally {
    session.endSession();
  }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { oldPassword, newPassword } = req.body;

    // Input validation
    if (!oldPassword || !newPassword) {
      return errorResponse(res, "Both old and new passwords are required");
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return errorResponse(res, "Password does not meet requirements", 400, passwordErrors);
    }

    const user = await User.findById(req.user.id).select("+password").session(session);
    
    if (!user) {
      await session.abortTransaction();
      return errorResponse(res, "User not found", 404);
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      await session.abortTransaction();
      // Generic message to prevent user enumeration
      return errorResponse(res, "Current password is incorrect", 401);
    }

    // Prevent reusing same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      await session.abortTransaction();
      return errorResponse(res, "New password must be different from current password");
    }

    // Update password
    user.password = await hashPassword(newPassword);
    
    // Optional: Invalidate all refresh tokens by updating a token version
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    
    await user.save({ session });
    await session.commitTransaction();

    // Send security notification email (non-blocking)
    sendEmail(
      user.email,
      "Password Changed - SmartSpend",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#1f2937;">Hello ${user.name},</h2>
        <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
        <p style="color:#dc2626;"><strong>If you didn't make this change, please contact support immediately.</strong></p>
        <p>Regards,<br><strong>SmartSpend Team</strong></p>
      </div>
      `
    ).catch(err => console.error("[Security Email Error]:", err.message));

    return successResponse(res, null, "Password updated successfully");
  } catch (error) {
    await session.abortTransaction();
    console.error("[ChangePassword Error]:", error);
    return errorResponse(res, "Failed to change password", 500);
  } finally {
    session.endSession();
  }
};

// ================= REQUEST EMAIL CHANGE =================
const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    // Validation
    if (!newEmail) {
      return errorResponse(res, "New email address is required");
    }

    if (!isValidEmail(newEmail)) {
      return errorResponse(res, "Please enter a valid email address");
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Check if same email
    if (normalizedEmail === user.email.toLowerCase()) {
      return errorResponse(res, "This is already your current email address");
    }

    // Check if email is taken (case-insensitive)
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      // Return same error as validation to prevent email enumeration
      return errorResponse(res, "Unable to process this email change request");
    }

    // Rate limit: prevent spam (check last request time)
    if (user.emailChangeExpires && user.emailChangeExpires > Date.now()) {
      const timeLeft = Math.ceil((user.emailChangeExpires - Date.now()) / 60000);
      return errorResponse(res, `Please wait ${timeLeft} minutes before requesting another email change`, 429);
    }

    const token = generateSecureToken();

    // Update user with pending email
    user.pendingEmail = normalizedEmail;
    user.emailChangeToken = token;
    user.emailChangeExpires = Date.now() + EMAIL_CHANGE_EXPIRY_MINUTES * 60 * 1000;

    await user.save();

    // Construct verification URL
    const baseUrl = process.env.FRONTEND_URL || "https://smart-spend-kohl.vercel.app";
    const verificationUrl = `${baseUrl}/confirm-email-change/${token}`;

    // Send email (with better template)
    await sendEmail(
      user.email,
      "Confirm Your Email Change - SmartSpend",
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563EB,#4f46e5);padding:30px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;">SmartSpend</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 30px;">
                    <h2 style="color:#1f2937;margin:0 0 16px;font-size:20px;">Hello ${user.name},</h2>
                    <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
                      We received a request to change your email address to <strong>${normalizedEmail}</strong>.
                    </p>
                    <p style="color:#4b5563;line-height:1.6;margin:0 0 32px;">
                      If this was you, click the button below to confirm:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${verificationUrl}" 
                             style="display:inline-block;background:linear-gradient(135deg,#2563EB,#4f46e5);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                            Confirm Email Change
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#6b7280;font-size:14px;margin:32px 0 0;line-height:1.6;">
                      This link will expire in <strong>${EMAIL_CHANGE_EXPIRY_MINUTES} minutes</strong>.<br>
                      If you didn't request this change, please ignore this email or contact support.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="color:#9ca3af;font-size:12px;margin:0;">
                      SmartSpend Team • Need help? Reply to this email
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `
    );

    return successResponse(res, null, `Verification email sent to ${user.email.slice(0, 3)}***@${user.email.split("@")[1]}`);
  } catch (error) {
    console.error("[RequestEmailChange Error]:", error);
    return errorResponse(res, "Failed to process email change request", 500);
  }
};

// ================= CONFIRM EMAIL CHANGE =================
const confirmEmailChange = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token } = req.params;

    if (!token || token.length !== 64) {
      await session.abortTransaction();
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_token`);
    }

    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeExpires: { $gt: Date.now() },
    }).session(session);

    if (!user) {
      await session.abortTransaction();
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=expired_or_invalid`);
    }

    // Double-check for duplicates in transaction
    const existingUser = await User.findOne({
      email: user.pendingEmail,
      _id: { $ne: user._id },
    }).session(session);

    if (existingUser) {
      await session.abortTransaction();
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=email_taken`);
    }

    const oldEmail = user.email;

    // Commit the change
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate old tokens

    await user.save({ session });
    await session.commitTransaction();

    // Notify old email about the change (security)
    sendEmail(
      oldEmail,
      "Email Address Updated - SmartSpend",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#1f2937;">Hello ${user.name},</h2>
        <p>Your email address has been successfully updated to <strong>${user.email}</strong>.</p>
        <p style="color:#dc2626;"><strong>If you didn't make this change, please contact support immediately.</strong></p>
      </div>
      `
    ).catch(err => console.error("[Notification Email Error]:", err.message));

    return res.redirect(`${process.env.FRONTEND_URL}/login?success=email_changed`);
  } catch (error) {
    await session.abortTransaction();
    console.error("[ConfirmEmailChange Error]:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  } finally {
    session.endSession();
  }
};

// ================= EXPORTS =================
module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
};