const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    cartNumber : { type: Number, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
