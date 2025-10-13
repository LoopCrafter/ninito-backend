import { Router } from "express";
import {
  getSettings,
  setSettings,
} from "../controllers/settings.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getSettings);

router.patch("/", requireAuth, authorizeRoles("admin"), setSettings);

export default router;
