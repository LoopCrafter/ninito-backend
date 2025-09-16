import { Address } from "../models/address.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
const createOrder = async (req, res) => {
  let { addressId, items, newAddress, totalPrice } = req.body;
  const userId = req.userId;
  if (!addressId && !newAddress) {
    return res
      .status(400)
      .json({ message: "Either addressId or address must be provided" });
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
      userId,
    });
    addressId = createdAddress._id;
  }
  let calculatedTotal = 0;

  const itemsWithPrice = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error("محصول یافت نشد");
      if (product.stock < item.quantity) throw new Error("موجودی کافی نیست");
      calculatedTotal += product.price * item.quantity;
      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  if (calculatedTotal !== totalPrice) {
    throw new Error("قیمت تغییر کرده است، لطفاً دوباره تلاش کنید");
  }

  const order = await Order.create({
    userId,
    addressId,
    items: itemsWithPrice,
    totalPrice,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "online",
  });

  res.status(201).json({ message: "Order created", order });
};

export { createOrder };
