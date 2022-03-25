const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    userId : {type : mongoose.Schema.Types.ObjectId , ref: "User"},
    discount : {type : mongoose.Schema.Types.ObjectId , ref: "Discount"}
  },
  { timestamps: true }
);


module.exports = mongoose.model("Seller", SellerSchema);
