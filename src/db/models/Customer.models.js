const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
  },
  { timestamps: true }
);

CustomerSchema.methods.itemCustomerModel = function () {
  return {
    user: this.user,
    discount: this.discount,

    // createdAt: this.createdAt,
    // updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Customer", CustomerSchema);
