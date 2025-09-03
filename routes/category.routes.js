import { Router } from "express";
import { createCategory } from "../controllers/category.controllers.js";
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

export default router;
