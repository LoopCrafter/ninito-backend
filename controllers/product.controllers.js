import { Product } from "../models/product.model.js";

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
};

const createNewProduct = async (req, res) => {
  try {
    const {
      title,
      category,
      variants,
      basePrice,
      discount,
      description,
      isFeatured,
    } = req.body;

    const thumbnail = req.files?.thumbnail
      ? `/uploads/products/${req.files.thumbnail[0].filename}`
      : null;
    const gallery = req.files?.gallery
      ? req.files.gallery.map((f) => `/uploads/products/${f.filename}`)
      : [];

    const parsedVariants = variants ? JSON.parse(variants) : [];
    const parsedDiscount = discount
      ? JSON.parse(discount)
      : { method: "percentage", value: 0 };

    if (!parsedVariants.length && !basePrice) {
      return res.status(400).json({
        success: false,
        message: "باید یا variants یا basePrice مشخص شود",
      });
    }

    const product = await Product.create({
      title,
      category,
      variants: parsedVariants,
      basePrice: basePrice ? parseFloat(basePrice) : undefined,
      discount: parsedDiscount,
      description,
      thumbnail,
      gallery,
      isFeatured: !!isFeatured,
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

    if (filter.inStock) {
      conditions.$or = [
        { "variants.stock": { $gt: 0 } },
        { baseStock: { $gt: 0 } },
      ];
    }

    if (req.userRole !== "admin") {
      conditions.isEnabled = true;
    }

    // Filter by price range
    if (filter.minPrice || filter.maxPrice) {
      conditions.$or = [{ "variants.price": {} }, { basePrice: {} }];

      if (filter.minPrice) {
        conditions.$or[0]["variants.price"].$gte = parseInt(filter.minPrice);
        conditions.$or[1].basePrice.$gte = parseInt(filter.minPrice);
      }
      if (filter.maxPrice) {
        conditions.$or[0]["variants.price"].$lte = parseInt(filter.maxPrice);
        conditions.$or[1].basePrice.$lte = parseInt(filter.maxPrice);
      }
    }
    if (search) {
      conditions.title = { $regex: search, $options: "i" };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      cheapest: { basePrice: 1, "variants.price": 1 },
      expensive: { basePrice: -1, "variants.price": -1 },
      mostViewed: { views: -1 },
      bestSelling: { soldCount: -1 },
      fastestShipping: { deliveryTime: 1 },
      topRated: { averageRating: -1 },
      featured: { isFeatured: -1, createdAt: -1 },
    };
    sortOptions[sort] = order === "asc" ? 1 : -1;
    const selectedSort = sortOptions[req.query.sortBy] || { createdAt: -1 };
    const [products, featuredProducts, total] = await Promise.all([
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
      Product.find({ isFeatured: true }),
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
      featured: featuredProducts,
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
    const {
      title,
      category,
      variants,
      basePrice,
      discount,
      description,
      removeThumbnail,
      removeGallery,
      isFeatured,
      isEnabled,
    } = req.body;

    const parsedVariants = variants ? JSON.parse(variants) : undefined;
    const parsedDiscount = discount ? JSON.parse(discount) : undefined;

    const parsedRemoveGallery = removeGallery ? JSON.parse(removeGallery) : [];

    const normalizedRemoveGallery = parsedRemoveGallery.map((url) => {
      if (url.includes("http://") || url.includes("https://")) {
        const urlObj = new URL(url);
        return urlObj.pathname;
      }
      return url;
    });

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "محصول یافت نشد",
      });
    }
    const updateData = {
      title,
      category,
      variants: parsedVariants,
      basePrice: basePrice ? parseFloat(basePrice) : undefined,
      discount: parsedDiscount,
      description,
      isFeatured: parseBoolean(isFeatured) && parseBoolean(isEnabled),
      isEnabled: parseBoolean(isEnabled),
    };

    if (req.files?.thumbnail) {
      updateData.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
    } else if (removeThumbnail === "true") {
      updateData.thumbnail = null;
    }

    if (req.files?.gallery) {
      const newGalleryImages = req.files.gallery.map(
        (f) => `/uploads/products/${f.filename}`
      );

      const existingGallery = currentProduct.gallery || [];
      const filteredExisting = existingGallery.filter(
        (img) => !normalizedRemoveGallery.includes(img)
      );
      updateData.gallery = [...filteredExisting, ...newGalleryImages];
    } else if (normalizedRemoveGallery.length > 0) {
      const existingGallery = currentProduct.gallery || [];
      updateData.gallery = existingGallery.filter(
        (img) => !normalizedRemoveGallery.includes(img)
      );
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "محصول با موفقیت بروزرسانی شد",
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
