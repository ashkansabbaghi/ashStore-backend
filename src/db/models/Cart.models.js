const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: String, default: 0 },
    /* ************************************ */
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
    totalPrice: { type: Number },
    totalDeliveryCost: { type: Number },
    deliveryAddress: { type: Object },
    paymentPrice: { type: Number },
    status: { type: String, enum: ["paid", "paying"], default: "paying" },
  },
  {
    timestamps: true,
  }
);

CartSchema.methods.itemCartModel = function () {
  return {
    cartId: this.id,
    user: this.user,
    orders: this.orders,
    totalPrice: this.totalPrice,
    totalDeliveryCost: this.totalDeliveryCost,
    deliveryAddress: this.deliveryAddress,
    paymentPrice: this.paymentPrice,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Cart", CartSchema);
