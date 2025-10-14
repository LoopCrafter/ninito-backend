import { Router } from "express";
import { body } from "express-validator";
import { CreateContact } from "../controllers/contact.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import rateLimit from "express-rate-limit";
import { sanitizeBody } from "../middlewares/sanitizeBody.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

router.post(
  "/",
  contactLimiter,
  [
    body("email").isEmail().withMessage("Invalid email address").escape(),
    body("message")
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 350 })
      .withMessage("متن پیام نمی‌تواند بیش از 350 کاراکتر باشد")
      .escape(),
    body("name").notEmpty().withMessage("Name is required").escape(),
    body("subject").notEmpty().withMessage("Subject is required").escape(),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number")
      .escape(),
  ],
  validate,
  CreateContact
);

export default router;
