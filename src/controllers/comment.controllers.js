const Comment = require("../db/models/Comment.models");
const Product = require("../db/models/Product.models");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    return res.status(200).json(comments);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "error sending comments",
      },
    });
  }
};

const createComment = async (req, res, next) => {
  const { productId, ...comment } = req.body; // remove productId from input
  const author = { author: { id: req.user.id, username: req.user.username } }; // create author
  const commentFinal = Object.assign(comment, author);
  try {
    const createComment = await Comment.create(commentFinal);
    const product = await Product.findByIdAndUpdate(
      req.body.productId,
      { $push: { comments: createComment.id } },
      { new: true, useFindAndModify: false }
    );
    return res.status(201).json(createComment);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "comment not created",
      },
    });
  }
};

const getListProductComment = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("comments");
    const comment = product.comments.map((comment) => {
      return comment;
    });
    return res.status(200).json(comment);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "comments not found",
      },
    });
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentId, ...item } = req.body; //remove id in body

    console.log(item);
    const updateComment = await Comment.findByIdAndUpdate(
      req.body.commentId,
      { $set: item },
      { new: true }
    );
    return res.status(200).json(updateComment);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "comment not updated",
      },
    });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.body.commentId);
    return res.status(200).json({ remove: comment });
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "comment not deleted",
      },
    });
  }
};

const deleteCommentSelf = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.body.commentId);
    console.log(req.user.id, comment, req.body.commentId);
    if (req.user.id === comment.author.id) {
      Comment.deleteOne({ _id: req.body.commentId }).then(() => {
        return res.status(200).json({ remove: comment });
      });
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          message: "You are not allowed to delete this comment",
        },
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "comment not deleted",
      },
    });
  }
};

/*********************** Functions *************************** */
const ValidCommentSelf = async (userId, commentId) => {
  return await Comment.findById(commentId).then((docComment) => {
    return docComment;
  });
};

module.exports = {
  getAllComments,
  createComment,
  getListProductComment,
  updateComment,
  deleteComment,
  deleteCommentSelf,
};
