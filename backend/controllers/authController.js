const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { BrevoClient } = require("@getbrevo/brevo");

// ─── Brevo Client ───
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

// ─── Async Handler (no more try-catch blocks everywhere) ───
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ─── Reusable Email Sender ───
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  await brevo.transactionalEmails.sendTransacEmail({
    subject,
    htmlContent,
    sender: {
      name: "SmartSpend",
      email: "smartspend.finance@gmail.com",
    },
    to: [{ email: toEmail, name: toName }],
  });
};

// ─── Token Generators ───
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// ─── Cookie Options ───
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Password Validation ───
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// ─── 1. REGISTER ───
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  if (!isStrongPassword(password)) {
  return res.status(400).json({
    message: "Password must be at least 6 characters",
 });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 15 * 60 * 1000, // 15 min
  });

  const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    toEmail: user.email,
    toName: user.name,
    subject: "SmartSpend - Verify Your Email",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Welcome to SmartSpend</h2>
        <p>Hello ${user.name},</p>
        <p>Thanks for creating your account. Please verify your email:</p>
        <a href="${verifyURL}" style="display:inline-block;background:#2563EB;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });

  res.status(201).json({
    success: true,
    message: "Verification email sent. Please check your inbox.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ─── 2. VERIFY EMAIL ───
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

// ─── 3. RESEND VERIFICATION ───
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    toEmail: user.email,
    toName: user.name,
    subject: "SmartSpend - Verify Your Email",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Here is your new verification link:</p>
        <a href="${verifyURL}" style="display:inline-block;background:#2563EB;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Verification email resent successfully",
  });
});

// ─── 4. LOGIN ───
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      toEmail: user.email,
      toName: user.name,
      subject: "SmartSpend - Verify Your Email",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Verify Your Email</h2>
          <p>Hello ${user.name},</p>
          <p>You tried to log in but your email is not verified.</p>
          <a href="${verifyURL}" style="display:inline-block;background:#2563EB;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    return res.status(403).json({
      message: "Email not verified. A new verification email has been sent.",
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token hash in DB for extra security
  const hashedRefresh = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefresh;
  await user.save();

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ─── 5. REFRESH ACCESS TOKEN ───
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefresh = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefresh) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const hashedIncoming = crypto
    .createHash("sha256")
    .update(incomingRefresh)
    .digest("hex");

  const user = await User.findOne({ refreshToken: hashedIncoming });

  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const decoded = jwt.verify(incomingRefresh, process.env.JWT_REFRESH_SECRET);

  if (decoded.id !== user._id.toString()) {
    return res.status(403).json({ message: "Token mismatch" });
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  const newHashedRefresh = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  user.refreshToken = newHashedRefresh;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

// ─── 6. LOGOUT ───
const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefresh = req.cookies?.refreshToken;

  if (incomingRefresh) {
    const hashedIncoming = crypto
      .createHash("sha256")
      .update(incomingRefresh)
      .digest("hex");

    const user = await User.findOne({ refreshToken: hashedIncoming });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ─── 7. FORGOT PASSWORD ───
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "No account found with this email" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedResetToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    toEmail: user.email,
    toName: user.name,
    subject: "SmartSpend - Password Reset",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click below:</p>
        <a href="${resetURL}" style="display:inline-block;background:#2563EB;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p>If you didn't request this, ignore this email.</p>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Reset link sent to your email",
  });
});

// ─── 8. RESET PASSWORD ───
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Please provide a new password" });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters with uppercase, lowercase, number and special character",
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.refreshToken = undefined; // Force re-login on all devices
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in with your new password.",
  });
});

// ─── 9. GET CURRENT USER ───
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});

module.exports = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
};