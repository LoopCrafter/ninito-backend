import { Router } from "express";
import {
  getAllUsers,
  getProfile,
  updateProfile,
} from "../controllers/user.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { profileValidation } from "../middlewares/user.middleware.js";
import { resizeImage } from "../middlewares/resize.middleware.js";
const uploadPath = "./uploads/users";
const router = Router();
router.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);

router.get("/profile", requireAuth, getProfile);
router.patch(
  "/profile",
  profileValidation,
  requireAuth,
  validate,
  uploaderManager.single(uploadPath, "image"),
  resizeImage(uploadPath),
  updateProfile
);
export default router;
