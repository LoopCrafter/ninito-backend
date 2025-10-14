import { Schema, model } from "mongoose";

const ContactUsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: {
      type: String,
      enum: [
        "product-question",
        "order-support",
        "complaint",
        "suggestion",
        "collaboration",
        "other",
      ],
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
export const Contact = model("Contact", ContactUsSchema);
