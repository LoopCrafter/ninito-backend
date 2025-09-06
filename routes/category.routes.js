import { Router } from "express";
import {
  createCategory,
  getCategories,
  categoryDetail,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import uploaderManager from "./../utils/FileUploaderManager.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";
import { resizeImage } from "../middlewares/resize.middleware.js";

const router = Router();
const uploadPath = "./uploads/categories";

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  uploaderManager.single(uploadPath, "image"),
  resizeImage(uploadPath),
  createCategory
);
router.get("/all", getCategories);
router.get("/:categoryId", categoryDetail);
router.patch(
  "/:categoryId",
  requireAuth,
  authorizeRoles("admin"),
  uploaderManager.single(uploadPath, "image"),
  resizeImage(uploadPath),
  updateCategory
);
router.delete(
  "/:categoryId",
  requireAuth,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;
