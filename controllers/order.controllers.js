import { Address } from "../models/address.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { getNextOrderNumber } from "../utils/getNextOrderNumber.js";
import mongoose from "mongoose";
const createOrder = async (req, res) => {
  let { addressId, items, newAddress, totalPrice } = req.body;
  const userId = req.userId;
  if (!addressId && !newAddress) {
    return res
      .status(400)
      .json({ message: "Either addressId or address must be provided", success: false });
  }
  if (newAddress) {
    const { title, address, city, province, postalCode, totalPrice } =
      newAddress;
    const createdAddress = await Address.create({
      title,
      address,
      city,
      province,
      postalCode,
      user: userId,
    });
    address = createdAddress._id;
  }

  const seq = await getNextOrderNumber();
  const orderNumber = `ORD-${new Date().getFullYear()}-${seq}`;

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let calculatedTotal = 0;
  const itemsWithPrice = items.map((item) => {
    const product = productMap.get(item.product);
    if (!product) throw new Error("محصول یافت نشد");
    if (product.stock < item.quantity) throw new Error("موجودی کافی نیست");
    calculatedTotal += product.price * item.quantity;
    return {
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  if (calculatedTotal !== totalPrice) {
    throw new Error("قیمت تغییر کرده است، لطفاً دوباره تلاش کنید");
  }

  const order = await Order.create({
    user: userId,
    address: addressId,
    items: itemsWithPrice,
    totalPrice,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "online",
    orderNumber,
  });

  res.status(201).json({ message: "Order created", order });
};

const getOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await Order.find({ user: userId })
      .populate("user", "id name email phone")
      .populate("address", "id title address city province postalCode")
      .populate("items.product", "title price finalPrice thumbnail gallery");

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const populatedOrder = await Order.findById(orderId)
      .populate("user", "id name email phone")
      .populate("address", "id title address city province postalCode")
      .populate("items.product", "title price finalPrice thumbnail gallery");

    res.json({ order: populatedOrder, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { createOrder, getOrders, getOrderById };
