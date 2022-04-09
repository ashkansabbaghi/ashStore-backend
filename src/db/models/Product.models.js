const mongoose = require("mongoose");

// valid limit
const arrayLimit = (val) => {
  return val.length <= 5;
};

const ProductSchema = new mongoose.Schema(
  {
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    }, // many to many
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], //one to many
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // one to aLot
    property: [], //one to few
    color: [], //one to few

    // ******************************************************************** //
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      unique: true,
    }, // one to many
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // one to many
    // ******************************************************************** //
    hotProduct: { type: Boolean, default: false },
    name: { type: String, unique: true },
    desc: { type: String },
    unit: { type: Number },
    price: { type: Number },
    publishedAt: { type: Date },
    startAt: { type: Date },
    endAt: { type: Date },
  },
  { timestamps: true }
);

ProductSchema.methods.itemProductModel = function () {
  return {
    auth: this.auth,
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
