import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 125,
  message: "Too many login attempts, please try again later.",
});

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(req.headers.authorization.split(" "), token);
  if (!token) {
    return res.status(401).json({ msg: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userRole = decoded.userRole;
    req.userId = decoded.id;
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
