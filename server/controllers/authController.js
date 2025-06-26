const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const { sendVerificationEmail, sendEmail } = require('../utils/mailer');
require('dotenv').config();

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { isVerified: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found.");
    res.send("Email successfully verified! You can now log in.");
  } catch (err) {
    res.status(400).send("Invalid or expired verification link.");
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isAdmin: isAdmin || false });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({ message: 'User registered successfully. A verification email has been sent. Please check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, captcha } = req.body;

    if (captcha) {
      try {
        const captchaRes = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          null,
          {
            params: {
              secret: process.env.RECAPTCHA_SECRET,
              response: captcha,
            },
          }
        );

        console.log("CAPTCHA response:", captchaRes.data);

        if (!captchaRes.data.success) {
          return res.status(400).json({ message: "CAPTCHA verification failed" });
        }
      } catch (captchaErr) {
        console.error("CAPTCHA check error:", captchaErr.message);
        return res.status(500).json({ message: "CAPTCHA validation failed. Try again." });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, name: user.name });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await sendVerificationEmail(user.email, token);

    res.status(200).json({ message: "Verification email resent!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend verification email", error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

    await sendEmail(email, {
      subject: "Reset Your Password",
      html: `<p>Click below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Failed to send reset link." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(400).json({ error: "Invalid or expired token." });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};