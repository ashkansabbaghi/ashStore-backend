const mongoose = require("mongoose");

// valid limit
const arrayLimit = (val) => {
  return val.length <= 5;
};

const BlogSchema = new mongoose.Schema(
  {
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    }, // many to many
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }, // one to many
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    /* ********************************************* */
    auth: { type: String, required: true, ref: "User" },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: true },
    comments: [
      {
        user: { type: String },
        content: { type: String },
        votes: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

BlogSchema.methods.itemBlogModel = function () {
  return {
    blogId: this._id,
    auth: this.auth,
    title: this.title,
    content: this.content,
    slug: this.slug,
    comments: this.comments,
    category: this.category,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Blog", BlogSchema);
