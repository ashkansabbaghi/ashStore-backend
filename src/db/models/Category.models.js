const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    parentId: { type: String },
    /* **************************************** */
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    isDelete: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

CategorySchema.methods.itemCategoryModel = function () {
  return {
    categoryId: this.id,
    slug: this.slug,
    title: this.title,
    parentId: this.parentId,

    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Category", CategorySchema);
