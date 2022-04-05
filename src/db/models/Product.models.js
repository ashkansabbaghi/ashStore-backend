const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // one to many
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // many to many
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // one to many
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, //one to many
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // one to aLot
    property: [], //one to few
    color: [], //one to few
    // ******************************************************************** //
    hotProduct: { type: Boolean, default: false },
    name: { type: String,  unique: true },
    desc: { type: String, },
    unit: { type: Number, },
    price: { type: Number, },
    publishedAt: { type: Date },
    startAt: { type: Date },
    endAt: { type: Date },
  },
  { timestamps: true }
);

ProductSchema.methods.itemProductModel = function () {
  return {
    auth : this.auth,
    tag: this.tag,
    name: this.name,
    desc: this.desc,
    unit: this.unit,
    price: this.price,
    startAt: this.startAt,
    endAt: this.endAt,
  };
};

module.exports = mongoose.model("Product", ProductSchema);
