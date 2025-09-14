import { Router } from "express";
import {
  createNewAddress,
  deleteAddress,
  getAddressDetails,
  getAllAddresses,
  updateAddress,
} from "../controllers/address.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("province").notEmpty().withMessage("Province is required"),
    body("postalCode").notEmpty().withMessage("Postal Code is required"),
  ],
  validate,
  createNewAddress
);
router.get("/", requireAuth, getAllAddresses);
router.get(
  "/:addressId",
  requireAuth,
  [param("addressId").isMongoId().withMessage("Invalid address ID")],
  validate,
  getAddressDetails
);
router.patch(
  "/:addressId",
  requireAuth,
  sanitizeBody([
    "title",
    "address",
    "city",
    "province",
    "postalCode",
    "location",
    "description",
  ]),
  [param("addressId").isMongoId().withMessage("Invalid address ID")],
  validate,
  updateAddress
);
router.delete(
  "/:addressId",
  requireAuth,
  [param("addressId").isMongoId().withMessage("Invalid address ID")],
  validate,
  deleteAddress
);

export default router;
