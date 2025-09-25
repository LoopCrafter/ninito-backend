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
const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    //(average + histogram)
    const stats = await Comment.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalReviews = stats.reduce((acc, cur) => acc + cur.count, 0);
    const sumRatings = stats.reduce((acc, cur) => acc + cur._id * cur.count, 0);
    const averageRating = totalReviews
      ? (sumRatings / totalReviews).toFixed(1)
      : 0;

    const histogram = [1, 2, 3, 4, 5].map((star) => {
      const found = stats.find((s) => s._id === star);
      return { star, count: found ? found.count : 0 };
    });

    // comments (pagination & sort)
    const sortOption =
      sort === "newest"
        ? { createdAt: -1 }
        : sort === "oldest"
        ? { createdAt: 1 }
        : {};

    const reviews = await Comment.find({ product: productId })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      stats: {
        averageRating,
        totalReviews,
        histogram,
      },
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateComment = (req, res) => {
  res.json({ message: "Comment updated" });
};

export { createComment, deleteComment, getComments, updateComment };
