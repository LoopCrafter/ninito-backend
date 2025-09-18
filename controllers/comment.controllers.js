import { Comment } from "../models/comment.model.js";
import { Product } from "../models/product.model.js";

const createComment = async (req, res) => {
  const { productId, userId, text, commentId } = req.body;
  try {
    if (commentId) {
      // Logic to reply to an existing comment
      return res.json({ message: `Reply to comment ${commentId} created` });
    } else {
      const comment = await Comment.create({ productId, userId, text });
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.comments.push(comment._id);
      await product.save();

      return res.json({
        message: "New comment created",
        success: true,
        comment,
        productComments: product.comments,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteComment = (req, res) => {
  res.json({ message: "Comment deleted" });
};
const getComments = (req, res) => {
  res.json({ message: "Comments retrieved" });
};
const updateComment = (req, res) => {
  res.json({ message: "Comment updated" });
};

export { createComment, deleteComment, getComments, updateComment };
