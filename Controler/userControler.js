import User from "../Model/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(401).json({ message: "Invalid data", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "This email is already used",
        success: false,
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({ fullName, email, password: hashedPassword });
    return res
      .status(201)
      .json({ message: "Account created succesfully.", success: true });
  } catch (error) {}
};

configDotenv();

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "Invalid data", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ userId: user._id }, process.env.secret, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      })
      .json({ message: `Welcome back ${user.fullName},`, success: true, user , "token":token});
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const Logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expiresIn: new Date(Date.now()), httpOnly: true })
    .json({ message: "User Logged out successfully", success: true });
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the reset link via email
    const resetURL = `${process.env.END_POINT}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `
  <div style="text-align: center; font-family: Arial, sans-serif;">
    
    <h2 style="color: #e50914;">Netflix</h2>
    <p>You requested a password reset.</p>
    <p>Click <a href="${resetURL}" style="color: #e50914; text-decoration: none; font-weight: bold;">here</a> to reset your password.</p>
  </div>
`,
    });

    res.status(200).json({
      message: "Password reset link sent to your email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Please try again.", success: false });
  }
};




export const GetResetPasswordPage = async (req, res) => {
  const { token } = req.query;

  // console.log("get resett password till working");
  // res.render("resetPassword", { token });

  const resetPasswordEndpoint = process.env.RESET_PASSWORD_ENDPOINT;  // Get the endpoint from .env
  res.render("resetPassword", { resetPasswordEndpoint },{token});
};




export const ResetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find user by token and check if the token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the password
    user.password = password; // Assume password hashing is handled in the model
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

