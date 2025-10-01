import {
  SendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sentPasswordResetEmail,
} from "../mailtrap/emails.js";
import {
  generateAccessToken,
  generateRefreshTokenAndSetCookie,
  generateVerificationToken,
  getExpiryDate,
} from "../utils/index.js";
import { User } from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { email, name, password, phone } = req.body;

  try {
    if (!email || !password || !name || !phone) {
      throw new Error("All Fields are Required");
    }

    const existPhone = await User.findOne({ phone });
    if (existPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = getExpiryDate(1);
    const user = new User({
      email,
      phone,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt,
      role: "user",
    });
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
        role: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) {
      throw new Error("Verification token is Required!");
    }
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired verification code!",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name, process.env.CLIENT_URL);
    //jwt
    const accessToken = generateAccessToken(res, user._id, user.role);
    generateRefreshTokenAndSetCookie(res, user._id, user.role);
    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
      user: {
        ...user._doc,
        password: undefined,
        role: undefined,
      },
      accessToken,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: "Account temporarily locked due to too many failed attempts",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
      }
      await user.save();
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(res, user._id, user.role);
    generateRefreshTokenAndSetCookie(res, user._id, user.role);

    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
        role: undefined,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new Error("Email is required!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sentPasswordResetEmail(user.email, resetUrl);
    res.status(200).json({
      success: true,
      message: "Password Reset Link sent to your Email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!token || !password) {
      throw new Error("All the fields are Required!");
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired reset Token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await SendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshAccessToken = req.cookies.refreshToken;
  if (!refreshAccessToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
    });
  }

  try {
    const decodedToken = jwt.verify(
      refreshAccessToken,
      process.env.JWT_REFRESH_SECRET
    );
    const accessToken = generateAccessToken(
      res,
      decodedToken.userId,
      decodedToken.userRole
    );
    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};
const userInfo = async (req, res) => {
  const { userId } = req;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    return res.status(400).json({ success: false, message: "User not Found!" });
  }

  res.status(200).json({ success: true, user });
};
export {
  signup,
  logout,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  userInfo,
};
