import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1250,
  message: "Too many login attempts, please try again later.",
});

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: "No token, unauthorized" });
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userRole = decoded.userRole;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified)
    return res.status(403).json({ message: "Verify email first" });
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole))
      return res.status(401).json({ msg: "Access denied" });
    next();
  };
};

export { loginLimiter, validate, requireVerified, requireAuth, authorizeRoles };
