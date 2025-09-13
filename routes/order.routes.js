import { Router } from "express";
import { body } from "express-validator";
import { createOrder } from "../controllers/orderController.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post(
  "/create",
  [
    body("userId").isMongoId().withMessage("Invalid userId"),
    body("addressId").optional().isMongoId().withMessage("Invalid addressId"),
    body("address")
      .optional()
      .custom((value, { req }) => {
        if (!req.body.addressId && !value) {
          throw new Error("Either addressId or address details are required");
        }
        if (value) {
          if (!value.city || !value.street || !value.postalCode) {
            throw new Error(
              "City, street, and postalCode are required in address"
            );
          }
        }
        return true;
      }),
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must be a non-empty array"),
    body("items.*.productId").isMongoId().withMessage("Invalid productId"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("paymentMethod")
      .isIn(["online"])
      .withMessage("Invalid payment method"),
  ],
  validate,
  createOrder
);

export default router;
