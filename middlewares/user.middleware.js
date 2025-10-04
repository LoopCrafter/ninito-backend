import { body } from "express-validator";

export const profileValidation = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام نمی‌تواند خالی باشد")
    .matches(/^[A-Za-z\u0600-\u06FF\s-]+$/)
    .withMessage("نام فقط باید شامل حروف باشد"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام خانوادگی نمی‌تواند خالی باشد")
    .matches(/^[A-Za-z\u0600-\u06FF\s-]+$/)
    .withMessage("نام خانوادگی فقط باید شامل حروف باشد"),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("ایمیل نمی‌تواند خالی باشد")
    .isEmail()
    .withMessage("فرمت ایمیل معتبر نیست"),

  body("password")
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و نماد باشد"
    ),

  body("gender")
    .optional()
    .isIn(["male", "female", "prefer_not_to_say"])
    .withMessage("جنسیت انتخاب شده معتبر نیست"),
];
