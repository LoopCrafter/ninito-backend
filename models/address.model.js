import { Schema, model } from "mongoose";
const addressSchema = new Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

addressSchema.index({ location: "2dsphere" });

export const Address = model("Address", addressSchema);
