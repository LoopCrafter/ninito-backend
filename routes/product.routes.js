import { Router } from "express";
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";
import uploaderManager from "./../utils/FileUploaderManager.js";
import { productValidations } from "../middlewares/product.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();
const uploadPath = "./uploads/products";

const uploadMiddleware = uploaderManager.fields(uploadPath, [
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  uploadMiddleware,
  productValidations,
  validate,
  createNewProduct
);

router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.delete(
  "/:productId",
  requireAuth,
  authorizeRoles("admin"),
  deleteProductById
);
router.patch(
  "/:productId",
  requireAuth,
  authorizeRoles("admin"),
  uploadMiddleware,
  // productValidations,
  updateProduct
);

export default router;
