const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    auth: { type: String ,required: true },
    item: {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
    deliveryCost: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "order", "posted", "received", "returned"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
