import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "canceled", "confirmed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["online"],
      default: "online",
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

export const Order = model("Order", orderSchema);
