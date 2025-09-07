import { Router } from "express";
import {
  createNewProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";
import uploaderManager from "./../utils/FileUploaderManager.js";
import { productValidations } from "../middlewares/product.middleware.js";

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
  createNewProduct
);

router.get("/", getAllProducts);

export default router;
