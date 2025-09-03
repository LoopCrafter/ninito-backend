import { Router } from "express";
import { Product } from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const newProduct = await Product.create({
    title: "ست خواب نوزاد",
    category: "10",
    price: 120000,
    discount: { method: "percentage", value: 10 },
    sizes: ["S", "M"],
    colors: [{ name: "آبی", hex: "#00f", gallery: ["img1.jpg", "img2.jpg"] }],
    description: "ست خواب نوزاد بسیار نرم و راحت",
    thumbnail: "thumb.jpg",
  });
  res.status(200).json({ message: "created successfully", success: true });
});

export default router;
