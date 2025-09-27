import { Page } from "../models/page.model.js";

const createPage = async (req, res) => {
  const { title, slug, content, metaTitle, metaDescription } = req.body;
  try {
    const newPost = await Page.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Page created successfully",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "server Error", success: false });
  }
};
const getAllPages = async (req, res) => {
  try {
    let { search = "", order = "asc", page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const conditions = {};

    if (search) {
      conditions.title = { $regex: search, $options: "i" };
    }
    const [pages, total] = await Promise.all([
      Page.find()
        .sort({ createdAt: order === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip)
        .populate("createdBy", "name email"),
      Page.countDocuments(conditions),
    ]);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      pages,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      lastPage: totalPages,
    });
  } catch (error) {
    res
      .statues(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};
const getPageBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const page = await Page.findOne({ slug }).populate(
      "createdBy",
      "name email"
    );
    if (!page) {
      res.status(404).json({ message: "Page not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Page fetched successfully", success: true, page });
  } catch (error) {
    res
      .statues(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

const updatePage = async (req, res) => {
  const { title, slug, content, metaTitle, metaDescription } = req.body;
  const updated = {};

  for (const key in req.body) {
    if (req.body[key] !== undefined) {
      updated[key] = req.body[key];
    }
  }
  try {
    const { pageId } = req.params;
    const page = await Page.findByIdAndUpdate(
      pageId,
      { $set: updated },
      { new: true }
    );
    if (!page) {
      return res
        .status(404)
        .json({ message: "Page not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Page updated successfully", success: true, page });
  } catch (error) {
    res
      .statues(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

const deletePage = async (req, res) => {
  const { pageId } = req.params;
  try {
    const deletedPage = await Page.deleteOne({ _id: pageId });
    if (deletedPage.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Page not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Page deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server Error", success: false });
  }
};

export { createPage, getPageBySlug, updatePage, deletePage, getAllPages };
