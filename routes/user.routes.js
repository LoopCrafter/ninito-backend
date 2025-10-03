import { Router } from "express";
import { getAllUsers, getProfile } from "../controllers/user.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);

router.get("/profile", requireAuth, getProfile);
export default router;
