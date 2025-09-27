import { Schema, model } from "mongoose";

const PageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    metaTitle: String,
    metaDescription: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Page = model("Page", PageSchema);
