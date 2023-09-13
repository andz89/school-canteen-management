import mongoose from "mongoose";

const foodsSchema = mongoose.Schema(
  {
    food_name: {
      type: String,
      required: true,
    },
    price: {
      type: Int,
      required: true,
    },
    descripture: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Foods = mongoose.model("Foods", foodsSchema);

export default Foods;
