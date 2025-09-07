import { validationResult } from "express-validator";
import { Product } from "../models/product.model.js";

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
    console.log(parsedSizes, sizes);
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
    const products = await Product.find();
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, product });
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
export { createNewProduct, getAllProducts, getProductById, deleteProductById };
