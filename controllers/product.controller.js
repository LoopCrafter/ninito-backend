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
    const product = await Product.create({
      title,
      category,
      price,
      discount,
      sizes,
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

export { createNewProduct };
