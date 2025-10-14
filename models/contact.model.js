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
const transformFunction = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
};

ContactUsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: transformFunction,
});

ContactUsSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: transformFunction,
});

export const Contact = model("Contact", ContactUsSchema);
