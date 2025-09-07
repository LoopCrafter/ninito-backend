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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find();
    categories = categories.map((item) => ({
      ...item.toObject(),
      image: item.image ? process.env.BASEURL + item.image : null,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const categoryDetail = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category Id is Required" });
  }
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found!" });
    }
    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const updates = req.body;
  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category Id is Required" });
  }
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    const allowedUpdates = ["title", "description", "image"];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        category[field] = updates[field];
      }
    });

    const file = req.file;
    if (updates.image === null || updates.image === "") {
      updates.image = undefined;
    }
    if (file) {
      category.image = `/uploads/categories/${file.filename}`;
    }
    const updatedCategory = await category.save();
    return res.status(201).json({
      success: true,
      message: "category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category Id is Required" });
  }
  try {
    const deletedCategory = await Category.deleteOne({ _id: categoryId });
    if (deletedCategory.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    return res.status(201).json({
      success: true,
      message: "Successfully Deleted",
      deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createCategory,
  getCategories,
  categoryDetail,
  updateCategory,
  deleteCategory,
};
