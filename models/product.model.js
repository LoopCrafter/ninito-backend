import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      method: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: { type: Number, default: 0 },
    },
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL"] }],
    colors: [
      {
        name: String,
        hex: String,
        gallery: [String],
      },
    ],
    description: String,
    thumbnail: String,
  },
  { timestamps: true }
);

ProductSchema.virtual("finalPrice").get(function () {
  if (!this.discount || !this.discount.value) return this.price;
  return this.discount.type === "percentage"
    ? this.price - (this.price * this.discount.value) / 100
    : this.price - this.discount.value;
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

export const Product = model("product", ProductSchema);
