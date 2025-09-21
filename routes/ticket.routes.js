import { Router } from "express";
import {
  createNewTicket,
  deleteTicket,
  getAllTickets,
  updateTicket,
} from "../controllers/ticket.controllers";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware";
const router = Router();

router.post("/", requireAuth, authorizeRoles("admin", "user"), createNewTicket);
router.get("/", requireAuth, getAllTickets);

router.patch("/:ticketId", requireAuth, updateTicket);
router.delete("/:ticketId", requireAuth("admin"), deleteTicket);

export default router;
