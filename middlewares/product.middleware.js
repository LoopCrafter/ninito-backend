import { body } from "express-validator";

const productValidations = [
  body("title").notEmpty().withMessage("عنوان الزامی است"),
  body("category")
    .notEmpty()
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("قیمت باید بزرگ‌تر از صفر باشد"),
  body("discount.method")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("نوع تخفیف نامعتبر است"),
  body("discount.value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("مقدار تخفیف نامعتبر است"),
  body("sizes").optional().isArray().withMessage("سایزها باید آرایه باشند"),
  body("colors").optional().isArray().withMessage("رنگ‌ها باید آرایه باشند"),
];

export { productValidations };
