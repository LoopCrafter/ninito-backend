import { Schema, model } from "mongoose";
import { applyDefaultTransforms } from "../utils/index.js";

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);

CategorySchema.virtual("thumbnailUrl").get(function () {
  return this.image ? `${process.env.BASEURL}${this.image}` : null;
});

applyDefaultTransforms(CategorySchema, ["image"]);

export const Category = model("Category", CategorySchema);
