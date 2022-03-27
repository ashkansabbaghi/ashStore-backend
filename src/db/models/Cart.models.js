const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    customerId: { type : mongoose.Schema.Types.ObjectId , ref: "Customer"},
    products: {
      // item cart
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 },
    },
    deliveryCost : {type : Number, required: true, default : 0},
    amount: {type: Number, required: true, default : 1},
    status: {}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);