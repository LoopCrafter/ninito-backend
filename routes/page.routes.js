import { Router } from "express";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";
import {
  createPage,
  deletePage,
  getAllPages,
  getPageBySlug,
  updatePage,
} from "../controllers/page.controllers.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

const pageValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("metaTitle").optional().isString(),
  body("metaDescription").optional().isString(),
];

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  pageValidator,
  validate,
  createPage
);
router.get("/", requireAuth, authorizeRoles("admin"), getAllPages);
router.get("/:slug", getPageBySlug);
router.patch("/:pageId", requireAuth, authorizeRoles("admin"), updatePage);
router.delete("/:pageId", requireAuth, authorizeRoles("admin"), deletePage);

export default router;
