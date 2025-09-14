import { Router } from "express";

const router = Router();
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { body } from "express-validator";

router.post(
  "/",
  [
    body("productId").notEmpty().withMessage("Product Id is required"),
    body("userId").notEmpty().withMessage("User Id is required"),
    body("text").notEmpty().withMessage("comment is required"),
  ],
  createComment
);
router.get("/:productId", getComments);
router.patch("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
