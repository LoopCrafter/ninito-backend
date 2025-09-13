import { Schema, model } from "mongoose";
const SettingsSchema = new Schema(
  {
    storeName: { type: String, required: true },
    storeLogo: { type: String },
    storeAddress: { type: String },
    storePhone: { type: String },

    shippingCost: { type: Number, default: 0 },
    freeShippingMinOrder: { type: Number, default: 0 },

    enableFreeShipping: { type: Boolean, default: false },
    notifyNewOrder: { type: Boolean, default: true },
    notifyNewMessage: { type: Boolean, default: true },
    notifyLowStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Settings = model("Settings", SettingsSchema);
