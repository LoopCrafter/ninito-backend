import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many signup attempts, please try again later.",
});

const requireAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({
      success: false,
      message: "No token provided, unauthorized",
    });
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const user = await User.findById(req.userId).select("role").lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Invalid user role",
      });
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    // distinguish error types
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - please refresh",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token signature",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Server error in authentication",
      });
    }
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified)
    return res.status(403).json({
      success: false,
      message: "Verify email first",
    });
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole))
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    next();
  };
};

export {
  loginLimiter,
  requireVerified,
  requireAuth,
  authorizeRoles,
  signupLimiter,
};
