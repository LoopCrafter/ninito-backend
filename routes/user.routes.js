import { Router } from "express";
import { getAllUsers } from "../controllers/user.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);
export default router;
