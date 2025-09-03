import { Router } from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controllers.js";
import uploaderManager from "./../utils/FileUploaderManager.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  uploaderManager.single("./uploads/categories", "image"),
  createCategory
);
router.get("/all", getCategories);

export default router;
