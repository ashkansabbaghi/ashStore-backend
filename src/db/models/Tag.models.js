const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", TagSchema);
