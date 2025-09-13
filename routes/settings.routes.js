import { Router } from "express";
import {
  getSettings,
  setSettings,
} from "../controllers/settings.controller.js";

const router = Router();

router.get("/", getSettings);

router.patch("/", setSettings);

export default router;
