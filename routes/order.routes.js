import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/order.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import orderValidation from "../middlewares/order.middleware.js";

const router = Router();

router.post("/", requireAuth, orderValidation, validate, createOrder);
router.get("/", requireAuth, getOrders);
router.get("/:orderId", requireAuth, getOrderById);

export default router;
