import mongoose from "mongoose";

const ordersSchema = mongoose.Schema(
  {
    orders: {
      type: Array,
      required: true,
    },

    details: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;
