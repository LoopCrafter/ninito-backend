import { Schema, model } from "mongoose";
const addressSchema = new Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Address = model("Address", addressSchema);
