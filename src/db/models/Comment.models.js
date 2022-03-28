const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product : {type: mongoose.Schema.Types.ObjectId, ref:"Product"},
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
