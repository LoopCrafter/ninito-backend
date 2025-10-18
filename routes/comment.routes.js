import { Router } from "express";

const router = Router();
import {
  createComment,
  deleteComment,
  getAllComments,
  getComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { body } from "express-validator";

router.get("/", getAllComments);
router.get("/:productId", getComments);
router.patch("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
