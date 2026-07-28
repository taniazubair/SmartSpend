const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ================= GET PROFILE =================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
      },
      {
        new: true,
      }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CHANGE PASSWORD =================

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Old password incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REQUEST EMAIL CHANGE =================

const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    const user = await User.findById(req.user.id);

    const token = crypto.randomBytes(32).toString("hex");

    user.pendingEmail = newEmail;
    user.emailChangeToken = token;
    user.emailChangeExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Send confirmation email
 await user.save();

console.log("Sending email to:", user.email);
console.log("Token:", token);

// Send confirmation email
await sendEmail(
  user.email,
  "Confirm your new email",
  `
    <h2>SmartSpend</h2>

    <p>Someone requested to change your email address.</p>

    <p>If this was you, click the button below:</p>

    <a href="https://smartspend-production-2753.up.railway.app/api/users/confirm-email-change/${token}">
      Confirm Email Change
    </a>

    <br><br>

    <p>If this wasn't you, you can safely ignore this email.</p>
  `
);

    res.json({
      success: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CONFIRM EMAIL CHANGE =================

const confirmEmailChange = async (req, res) => {
  try {
    const user = await User.findOne({
      emailChangeToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (user.emailChangeExpires < Date.now()) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailChangeToken = null;
    user.emailChangeExpires = null;

    await user.save();

   return res.redirect(
  "https://smart-spend-kohl.vercel.app/login?emailChanged=true"
);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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