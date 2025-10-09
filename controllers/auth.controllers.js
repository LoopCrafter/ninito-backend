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
  const { email, firstName, password, phone, gender, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !phone) {
      throw new Error("تمام فیلدها الزامی هستند");
    }

    const existPhone = await User.findOne({ phone });

    if (existPhone) {
      return res.status(400).json({
        success: false,
        message: "شماره تلفن قبلاً ثبت شده است",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "ایمیل قبلاً ثبت شده است" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = getExpiryDate(1);
    const user = new User({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
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
      message: error.message || "خطای داخلی سرور",
    });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) {
      throw new Error("کد تأیید الزامی است!");
    }
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "کد تأیید نامعتبر یا منقضی شده است!",
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
      message: "ایمیل با موفقیت تأیید شد",
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
      message: "خطای داخلی سرور",
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
        .json({ success: false, message: "اطلاعات ورود نامعتبر است" });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: "حساب کاربری به دلیل تلاش‌های ناموفق موقتاً قفل شده است",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = Date.now() + 30 * 60 * 1000;
      }
      await user.save();
      return res
        .status(400)
        .json({ success: false, message: "اطلاعات ورود نامعتبر است" });
    }

    const accessToken = generateAccessToken(res, user._id, user.role);
    const refreshToken = generateRefreshTokenAndSetCookie(
      res,
      user._id,
      user.role
    );
    generateRefreshTokenAndSetCookie(res, user._id, user.role);

    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "ورود با موفقیت انجام شد",
      user: {
        ...user._doc,
        password: undefined,
        role: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
        accountLockedUntil: undefined,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
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

  res.status(200).json({ success: true, message: "خروج با موفقیت انجام شد" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new Error("ایمیل الزامی است!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "کاربر یافت نشد" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //email
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    await sentPasswordResetEmail(user.email, resetUrl);
    res.status(200).json({
      success: true,
      message: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
    });
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!token || !password) {
      throw new Error("تمام فیلدها الزامی هستند");
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "توکن بازیابی نامعتبر یا منقضی شده است",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await SendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshAccessToken = req.cookies.refreshToken;
  if (!refreshAccessToken) {
    return res.status(401).json({
      success: false,
      message: "رفرش توکن یافت نشد",
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
      message: "توکن دسترسی با موفقیت نوسازی شد",
      accessToken,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "رفرش توکن نامعتبر یا منقضی شده است" });
  }
};
const userInfo = async (req, res) => {
  const { userId } = req;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    return res.status(400).json({ success: false, message: "کاربر یافت نشد!" });
  }

  res.status(200).json({ success: true, user });
};

const checkAuth = async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(400).json({ success: false, message: "کاربر یافت نشد!" });
  }
  res.status(200).json({
    success: true,
    user: {
      ...user._doc,
      password: undefined,
      role: undefined,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpiresAt: undefined,
      accountLockedUntil: undefined,
    },
  });
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
  checkAuth,
};
