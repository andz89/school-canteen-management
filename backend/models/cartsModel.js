import mongoose from "mongoose";

const cartsSchema = mongoose.Schema(
  {
    buyerId: {
      type: String,
      required: true,
    },
    food_name: {
      type: String,
      required: true,
    },
    food_id: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    orig_price: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_one: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Carts = mongoose.model("Carts", cartsSchema);

export default Carts;
