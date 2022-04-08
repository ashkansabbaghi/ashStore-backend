const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    // parentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category"}],
    parentId: { type: String },
    /* **************************************** */
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
