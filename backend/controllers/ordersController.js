import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Order from "../models/ordersModel.js";
import { format } from "date-fns";
import Food from "../models/foodsModel.js";

// @desc    add Post
// @route   POST /api/users/addpost
// @access  Private

const setNewOrder = asyncHandler(async (req, res) => {
  const { orders, details } = req.body;
  let available = true;
  for (let i = 0; i < orders.length; i++) {
    let _id = orders[i].food_id;
    let food = await Food.findOne({ _id });
    if (food.quantity === 0) {
      available = false;
      console.log(available);
      break;
    }

    food.quantity = food.quantity - 1;

    await food.save();
  }

  if (available === true) {
    const newOrder = await Order.create({
      orders: orders,
      details: details,
    });

    res.json({ newOrder });
  } else {
    console.log("hrer");
    let data = {
      msg: "not available",
    };
    res.json("not available");
  }
});
// @desc    Get organizer posts
// @route   GET /api/posts
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  if (req.user.roles[0] === "admin") {
    if (orders) {
      res.json(orders);
    } else {
      res.status(404);
      throw new Error("foods not found");
    }
  } else {
    if (orders) {
      let userId = req.user._id.toString();
      let user_orders = orders.filter((food) => {
        return food.details.userId === userId;
      });

      res.json(user_orders);
    } else {
      res.status(404);
      throw new Error("foods not found");
    }
  }
});

const editOrder = asyncHandler(async (req, res) => {
  const orderId = req.body.orderId;
  const status = req.body.status;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Item order not found" });
    }

    // Update the food's properties based on the request body data.
    order.details.status = status;

    // Mark the 'details' field as modified
    order.markModified("details");
    order.markModified("updatedAt");

    // Save the updated order.
    const updatedOrder = await order.save();

    // Respond with the updated order data.
    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export { setNewOrder, getOrders, editOrder };
