const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


const sendEmailModule = require("../utils/sendEmail");
const sendEmail = typeof sendEmailModule === 'function' ? sendEmailModule : sendEmailModule.sendEmail;

console.log("sendEmail loaded:", typeof sendEmail);

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { returnDocument: 'after' }
    ).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REQUEST EMAIL CHANGE =================
const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already associated with another account.",
      });
    }

    const user = await User.findById(req.user.id);

    const token = crypto.randomBytes(32).toString("hex");

    user.pendingEmail = newEmail;
    user.emailChangeToken = token;
    user.emailChangeExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log("Sending email to:", user.email);
    console.log("Token:", token);

    await sendEmail(
      user.email,
      "Confirm your new email - SmartSpend",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>SmartSpend</h2>
        <p>Someone requested to change your email address.</p>
        <p>If this was you, click below:</p>
        <a 
          href="https://smartspend-production-2753.up.railway.app/api/users/confirm-email-change/${token}"
          style="
            display:inline-block;
            background:#2563EB;
            color:white;
            padding:12px 20px;
            border-radius:6px;
            text-decoration:none;
          "
        >
          Confirm Email Change
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If this wasn't you, ignore this email.</p>
      </div>
      `
    );

    console.log("Confirmation email sent successfully");

    res.json({
      success: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    console.log("EMAIL CHANGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= CONFIRM EMAIL CHANGE =================
const confirmEmailChange = async (req, res) => {
  try {
    const user = await User.findOne({
      emailChangeToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.emailChangeExpires < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Safety check: kisi aur user ke paas toh nahi yeh email
    const existingUser = await User.findOne({ email: user.pendingEmail });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.redirect(
        "https://smart-spend-kohl.vercel.app/login?emailChanged=duplicate"
      );
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
};