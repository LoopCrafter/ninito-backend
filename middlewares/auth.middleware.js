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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Access token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid access token" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Server error verifying token" });
    }
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified)
    return res.status(403).json({ message: "Verify email first" });
  next();
};

export { loginLimiter, validate, requireVerified, requireAuth };
