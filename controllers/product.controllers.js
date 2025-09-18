import { validationResult } from "express-validator";
import { Product } from "../models/product.model.js";
import { Comment } from "../models/comment.model.js";

const createNewProduct = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { title, category, price, discount, sizes, colors, description } =
      req.body;

    const thumbnail = req.files?.thumbnail
      ? `/uploads/products/${req.files.thumbnail[0].filename}`
      : null;
    const gallery = req.files?.gallery
      ? req.files.gallery.map((f) => `/uploads/products/${f.filename}`)
      : [];
    const parsedColors = colors ? JSON.parse(colors) : [];
    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const product = await Product.create({
      title,
      category,
      price,
      discount,
      sizes: parsedSizes,
      colors: parsedColors,
      description,
      thumbnail,
      gallery,
    });
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let {
      search = "",
      sort = "createdAt",
      order = "asc",
      page = 1,
      limit = 5,
      filter = {},
    } = req.query;

    const skip = (page - 1) * limit;
    const conditions = {};

    if (filter.category) conditions.category = filter.category;
    if (filter.inStock) conditions["sizes.stock"] = { $gt: 0 };
    if (filter.minPrice || filter.maxPrice) {
      conditions.price = {};
      if (filter.minPrice) conditions.price.$gte = parseInt(filter.minPrice);
      if (filter.maxPrice) conditions.price.$lte = parseInt(filter.maxPrice);
    }
    if (search) {
      conditions.title = { $regex: search, $options: "i" };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      cheapest: { price: 1 },
      expensive: { price: -1 },
      mostViewed: { views: -1 },
      bestSelling: { soldCount: -1 },
      fastestShipping: { deliveryTime: 1 },
      topRated: { averageRating: -1 },
      featured: { isFeatured: -1, createdAt: -1 },
    };
    sortOptions[sort] = order === "asc" ? 1 : -1;
    const selectedSort = sortOptions[req.query.sortBy] || { createdAt: -1 };
    const [products, total] = await Promise.all([
      Product.find(conditions)
        .sort(selectedSort)
        .skip(skip)
        .limit(limit)
        .populate("category", "title image id")
        .populate({
          path: "comments",
          select: "productId text userId",
          populate: { path: "userId", select: "name email" },
        }),
      Product.countDocuments(conditions),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      lastPage: totalPages,
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({ _id: productId })
      .populate({
        path: "comments",
        select: "productId text userId",
        populate: { path: "userId", select: "name email" },
      })
      .populate("category", "title image id");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let productObj = product.toObject();
    if (productObj.comments.length > 0) {
      productObj.comments = productObj.comments.map((comment) => ({
        id: comment._id.toString(),
        productId: comment.productId.toString(),
        user: {
          id: comment.userId._id.toString(),
          name: comment.userId.name,
          email: comment.userId.email,
        },
        text: comment.text,
      }));
    }

    return res.json({ success: true, product: productObj });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await Product.deleteOne({ _id: productId });
    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  
  const { productId } = req.params;
  try {
    const { title, category, price, discount, sizes, colors, description } =
      req.body;
    const parsedDiscount = discount ? JSON.parse(discount) : undefined;
    const parsedSizes = sizes ? JSON.parse(sizes) : undefined;
    const parsedColors = colors ? JSON.parse(colors) : undefined;

    const updateData = {
      title,
      categoryId: category.id,
      price,
      discount: parsedDiscount,
      sizes: parsedSizes,
      colors: parsedColors,
      description,
    };

    const product = await Product.updateOne({ _id: productId }, updateData);

    res.json({
      message: "successfully Updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export {
  createNewProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProduct,
};
