import { Category } from "../models/category.model.js";

const createCategory = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is Required" });
  }
  const file = req.file;
  const imageUrl = file ? `/uploads/categories/${file.filename}` : null;
  try {
    const category = await Category.create({
      title,
      description,
      image: imageUrl,
    });
    return res.status(201).json({ success: true, category: category._doc });
  } catch (e) {
    return res.status(500).json({ error: err.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (e) {
    return res.status(500).json({ error: err.message });
  }
};
const categoryDetail = (req, res) => {
  res.json({ message: "categories list" });
};
const updateCategory = (req, res) => {
  res.json({ message: "categories list" });
};
const deleteCategory = (req, res) => {
  res.json({ message: "categories list" });
};

export {
  createCategory,
  getCategories,
  categoryDetail,
  updateCategory,
  deleteCategory,
};
