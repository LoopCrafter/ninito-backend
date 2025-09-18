import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

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

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ 
      success: false, 
      message: "No token, unauthorized" 
    });
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "No token, unauthorized" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userRole = decoded.userRole;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified)
    return res.status(403).json({ 
      success: false, 
      message: "Verify email first" 
    });
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole))
      return res.status(401).json({ 
        success: false, 
        message: "Access denied" 
      });
    next();
  };
};

export { loginLimiter, validate, requireVerified, requireAuth, authorizeRoles, signupLimiter };
