import { Router } from "express";
import {
  closeTicket,
  createNewTicket,
  deleteTicket,
  getAllTickets,
  getTicketDetails,
  updateTicket,
} from "../controllers/ticket.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";
const router = Router();

router.post(
  "/",
  requireAuth,
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  validate,
  createNewTicket
);

router.get("/", requireAuth, getAllTickets);
router.get("/:ticketId/messages", requireAuth, getTicketDetails);

router.patch(
  "/:ticketId",
  [body("message").notEmpty().withMessage("Message is required")],
  validate,
  requireAuth,
  updateTicket
);
router.delete("/:ticketId", requireAuth, deleteTicket);

router.post(
  "/:ticketId/close",
  requireAuth,
  [param("ticketId").isMongoId().withMessage("Invalid ticket ID")],
  validate,
  closeTicket
);

export default router;
