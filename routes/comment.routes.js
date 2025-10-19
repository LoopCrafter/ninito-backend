import { Router } from "express";

const router = Router();
import {
  createComment,
  deleteComment,
  getAllComments,
  getComments,
  updateComment,
  updateConfirmation,
} from "../controllers/comment.controllers.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

router.get("/", getAllComments);
router.get(
  "/product/:productId",
  requireAuth,
  authorizeRoles("admin"),
  getComments
);
router.patch("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);
router.patch("/:commentId/confirm", updateConfirmation);
export default router;
