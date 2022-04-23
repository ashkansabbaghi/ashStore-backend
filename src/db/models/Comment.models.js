const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    parentId: { type: String },
    /**************************************************************** */
    author: { id: { type: String }, username: { type: String } },
    text: { type: String },
    image: { type: String },
    commentStatus: {
      type: String,
      enum: ["pending", "approved","deleted"],
      default: "approved",
    },
  },
  { timestamps: true }
);

CommentSchema.methods.itemCommentModel = function () {
  return {
    commentId : this._id,
    author: this.author,
    text: this.text,
    image: this.image,
    product: this.product,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Comment", CommentSchema);
