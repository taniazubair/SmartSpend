const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});
// Signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 15 * 60 * 1000,
    });


    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;


    await brevo.transactionalEmails.sendTransacEmail({

      subject: "SmartSpend - Verify Your Email",

      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">

          <h2>Welcome to SmartSpend 🎉</h2>

          <p>Hello ${user.name},</p>

          <p>Thanks for creating your account.</p>

          <p>Please verify your email address:</p>

          <a 
            href="${verifyURL}"
            style="
              display:inline-block;
              background:#2563EB;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Verify Email
          </a>

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


    res.status(201).json({
      message: "Verification email sent. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });


  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

   if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email first",
  });
}

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }


    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();


    // Reset URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    // Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "SmartSpend Password Reset",
      html: `
        <h2>SmartSpend Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>Click the link below:</p>

        <a href="${resetURL}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });


    res.status(200).json({
      message: "Reset link sent to your email",
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};