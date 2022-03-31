const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    user : {type : mongoose.Schema.Types.ObjectId, ref: "User"},
    country: { type: String, default: "iran" },
    state: { type: String },
    city: { type: String },
    street: { type: String },
    continueAddress: { type: String },
    postCode: { type: Number , min : 10  , default : 0 , required : true},
  },
  { timestamps: true }
);

addressSchema.methods.itemAddressModel = function () {
  return {
    addressId : this._id,
    country: this.country,
    state: this.state,
    city: this.city,
    street: this.street,
    continueAddress: this.continueAddress,
    postCode : this.postCode,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Address", addressSchema);
