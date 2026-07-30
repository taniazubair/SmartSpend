console.log("Auth routes loaded");

const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
;
const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});
const User = require("../models/user");
const {
  registerUser,
  loginUser,
  resendVerification,
} = require("../controllers/authController");

const router = express.Router();

// ================= Existing Routes =================

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resend-verification", resendVerification);

// ================= Email Verification =================

router.get("/verify-email/:token", async (req,res)=>{
  try {

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");


    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: {
        $gt: Date.now()
      }
    });


    if(!user){
      return res.status(400).json({
        message:"Invalid or expired verification link"
      });
    }


    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();


    res.json({
      message:"Email verified successfully"
    });


  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
});

// ================= Forgot Password =================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent.",
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send Email using Brevo
    const response = await brevo.transactionalEmails.sendTransacEmail({
  subject: "SmartSpend - Password Reset",

  htmlContent: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2>Password Reset Request</h2>

      <p>Hello ${user.name},</p>

      <p>You requested a password reset.</p>

      <p>
        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            background:#2563EB;
            color:#fff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>
      </p>

      <p>This link expires in 15 minutes.</p>
    </div>
  `,

  sender: {
    name: "SmartSpend",
    email: "smartspend.finance@gmail.com",
  },

  to: [
    {
      email: user.email,
      name: user.name,
    },
  ],
});

console.log(response);

    res.status(200).json({
      message: "Reset link sent successfully.",
    });
  } catch (error) {
  console.error("========== BREVO ERROR ==========");

  console.error(error);

  if (error.response) {
    console.error("Status:", error.response.status);

    try {
      console.error(
        "Body:",
        await error.response.text()
      );
    } catch (e) {
      console.error(e);
    }
  }

  console.error("===============================");

  res.status(500).json({
    error: "Failed to send reset email.",
  });
}
});

// ================= Verify Token =================

router.get("/verify-reset-token/:token", async (req, res) => {
  try {

    console.log("TOKEN FROM URL:", req.params.token);

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log("HASHED TOKEN:", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    res.status(200).json({
      valid: true,
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// ================= Reset Password =================

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful!",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      error: "Failed to reset password",
    });
  }
});

module.exports = router;