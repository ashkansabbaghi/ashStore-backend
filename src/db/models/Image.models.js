const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    alt: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, required: true },
  },
  { timestamps: true }
);

ImageSchema.methods.itemProductModel = function () {
  return {
    imageId :this.id,
    alt: this.alt,
    url: this.image,
    caption: this.caption,
    //
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Image", ImageSchema);
