import express from "express";
import {
  setNewOrder,
  getOrders,
  editOrder,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

export default router;
