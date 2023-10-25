import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Order from "../models/ordersModel.js";
import { deleteImage } from "../helper/deleteImage.js";
// @desc    add Post
// @route   POST /api/users/addpost
// @access  Private

const setNewOrder = asyncHandler(async (req, res) => {
  const { orders, details } = req.body;

  const newOrder = await Order.create({
    orders: orders,
    details: details,
  });

  res.json({ newOrder });
});
// @desc    Get organizer posts
// @route   GET /api/posts
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("foods not found");
  }
});

const removeFoodToCart = asyncHandler(async (req, res) => {
  const foodId = req.body.cartId;

  try {
    // Use async/await with findByIdAndRemove to ensure proper handling of asynchronous code.
    const removedCart = await Cart.findByIdAndRemove(foodId);
    // Check if the Cart was found   and removed successfully.
    if (!removedCart) {
      return res.status(404).json({ message: "cart not found" });
    }

    res.json({ message: "item removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { setNewOrder, getOrders };
