import { Schema, model } from "mongoose";
import { applyDefaultTransforms } from "../utils/index.js";

const ProductSchema = new Schema(
  {
    title: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    variants: [
      {
        size: { type: String, enum: ["XS", "S", "M", "L", "XL"] },
        color: { name: String, hex: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0, min: 0 },
        sku: String,
      },
    ],

    basePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function () {
          return !this.variants || this.variants.length === 0;
        },
        message: "basePrice فقط برای محصولات بدون variant مجازه",
      },
    },
    discount: {
      method: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: { type: Number, default: 0 },
    },

    description: String,
    thumbnail: String,
    gallery: [String],
  },
  { timestamps: true }
);

ProductSchema.virtual("variantsWithFinalPrice").get(function () {
  if (!this.variants || this.variants.length === 0) return [];

  return this.variants.map((variant) => {
    let finalPrice = variant.price;
    if (this.discount && this.discount.value > 0) {
      finalPrice =
        this.discount.method === "percentage"
          ? variant.price - (variant.price * this.discount.value) / 100
          : variant.price - this.discount.value;
    }
    return { ...variant.toObject(), finalPrice };
  });
});

ProductSchema.virtual("thumbnailUrl").get(function () {
  return this.thumbnail ? `${process.env.BASEURL}${this.thumbnail}` : null;
});

ProductSchema.virtual("galleryUrls").get(function () {
  if (!this.gallery || this.gallery.length === 0) return [];
  return this.gallery.map((img) => `${process.env.BASEURL}${img}`);
});

ProductSchema.virtual("finalBasePrice").get(function () {
  if (!this.basePrice) return null;
  if (!this.discount || this.discount.value <= 0) return this.basePrice;

  return this.discount.method === "percentage"
    ? this.basePrice - (this.basePrice * this.discount.value) / 100
    : this.basePrice - this.discount.value;
});

ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ "variants.sku": 1 });
ProductSchema.index({ totalStock: 1 });

applyDefaultTransforms(ProductSchema, ["thumbnail", "gallery"]);

export const Product = model("Product", ProductSchema);
