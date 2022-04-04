const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    /**************************************************************** */
    author: { id: { type: String }, username: { type: String } },
    text: { type: String },
    image: { type: String },
    commentStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
    },
    parentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

CommentSchema.methods.itemCommentModel = function () {
  return {
    author: this.author,
    text: this.text,
    image: this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Comment", CommentSchema);
