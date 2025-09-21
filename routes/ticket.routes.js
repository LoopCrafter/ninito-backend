import { Router } from "express";
import {
  createNewTicket,
  deleteTicket,
  getAllTickets,
  updateTicket,
} from "../controllers/ticket.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
const router = Router();

router.post(
  "/",
  requireAuth,
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  createNewTicket
);
router.get("/", requireAuth, getAllTickets);

router.patch("/:ticketId", requireAuth, updateTicket);
router.delete("/:ticketId", requireAuth("admin"), deleteTicket);

export default router;
