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
    discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },

    // ******************************************************************** //
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }, // one to many
    auth: { type: Object, ref: "User" }, // one to many
    // ******************************************************************** //
    hotProduct: { type: Boolean, default: false },
    name: { type: String, unique: true },
    slug: { type: String },
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
    productId :this._id,
    auth: this.auth,
    tag: this.tag,
    discount: this.discount,
    name: this.name,
    slug: this.slug,
    desc: this.desc,
    unit: this.unit,
    price: this.price,
    startAt: this.startAt,
    endAt: this.endAt,
    image  : this.image,
    property: this.property,
    color: this.color,
    comment: this.comment,
    category: this.category,
    hotProduct: this.hotProduct,
    publishedAt: this.publishedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model("Product", ProductSchema);
