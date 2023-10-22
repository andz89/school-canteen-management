import mongoose from "mongoose";

const cartsSchema = mongoose.Schema(
  {
    food_name: {
      type: String,
      required: true,
    },
    food_id: {
      type: String,
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
