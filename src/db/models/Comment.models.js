const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    text: { type: String },
  },
  { timestamps: true }
);

CommentSchema.methods.itemProductModel = function () {
  return {
    userId: this.userId,
    text: this.text,
    //
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Comment", CommentSchema);
