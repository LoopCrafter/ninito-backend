import { Router } from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  userInfo,
} from "../controllers/auth.controllers.js";
import { body } from "express-validator";
import {
  loginLimiter,
  validate,
  requireAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/signup",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 chars long and include uppercase, lowercase, number, and symbol"
      ),
  ],
  validate,
  signup
);
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);
router.post("/logout", requireAuth, logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.post("/reset-password/:token", loginLimiter, resetPassword);
router.post("/refresh-token", loginLimiter, refreshAccessToken);
router.get("/me", loginLimiter, requireAuth, userInfo);
export default router;
