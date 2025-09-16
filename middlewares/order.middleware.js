import { body } from "express-validator";

const orderValidation = [
  body("addressId").optional().isMongoId().withMessage("Invalid addressId"),
  body("newAddress")
    .optional()
    .custom((value, { req }) => {
      if (!req.body.addressId && !value) {
        throw new Error("Either addressId or address details are required");
      }
      if (value) {
        if (
          !value.city ||
          !value.postalCode ||
          !value.title ||
          !value.province ||
          !value.title ||
          !value.address
        ) {
          throw new Error(
            "Title, Address, Province, City, and postalCode are required in address"
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
  body("paymentMethod").isIn(["online"]).withMessage("Invalid payment method"),
];

export default orderValidation;
