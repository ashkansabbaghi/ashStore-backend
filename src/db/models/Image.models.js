const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    alt: { type: String, required: true },
    image : { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

ImageSchema.methods.itemProductModel = function () {
  return {
    imageId :this._id,
    alt: this.alt,
    image: this.image,
    //
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Image", ImageSchema);
