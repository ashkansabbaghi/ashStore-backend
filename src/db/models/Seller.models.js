const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    codeSeller: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);
