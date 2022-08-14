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
    const product = await Product.findById(req.body.productId).populate(
      "comments"
    );
    const comments = product.comments.filter((comment) => {
      return comment.commentStatus === "approved";
    });
    const listComments = createParentComments(comments);
    return res.status(200).json(listComments);
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
    if (req.user.role == "admin") {
      const { commentId, ...item } = req.body; //remove id in body
      Comment.findByIdAndUpdate(
        req.body.commentId,
        { $set: item },
        { new: true }
      ).then((upComment) => {
        if (upComment) {
          return res.status(200).json(upComment);
        } else {
          return res.status(500).json({
            error: {
              status: 500,
              message: "not found comment",
            },
          });
        }
      });
    } else {
      const valid = await validSelfComment(req.body.commentId, req.user);
      if (valid.status === 200) {
        const { commentId, ...item } = req.body; //remove id in body
        Comment.findByIdAndUpdate(
          req.body.commentId,
          { $set: item },
          { new: true }
        ).then((upComment) => {
          if (upComment) {
            // console.log("update comment :", upComment);
            return res.status(valid.status).json(upComment);
          } else {
            return res.status(500).json({
              error: {
                status: 500,
                message: "not found comment",
              },
            });
          }
        });
      } else {
        return res.status(valid.status).json({
          error: {
            status: valid.status,
            message: valid.msg,
          },
        });
      }
    }
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
  const valid = await validSelfComment(req.body.commentId, req.user);
  if (req.user.isAdmin) {
    const commentId = req.body.commentId;
    Comment.findByIdAndUpdate(
      commentId,
      { $set: { commentStatus: "deleted" } },
      { new: true }
    ).then((resComment) => {
      Product.findOneAndUpdate({
        $pull: { comments: req.body.commentId },
      }).then((response) => {
        return res.status(200).json({
          status: 200,
          message: "remove comment",
          data: resComment.itemCommentModel(),
        });
      });
    });
  } else if (valid.status === 200) {
    Comment.findByIdAndUpdate(
      valid.res,
      { $set: { commentStatus: "deleted" } },
      { new: true }
    ).then((response) => {
      Product.findOneAndUpdate({
        $pull: { comments: req.body.commentId },
      }).then((response) => {
        return res.status(valid.status).json({
          status: 200,
          message: "remove comment",
          data: valid.comment,
        });
      });
    });
  } else {
    return res.status(valid.status).json({
      error: {
        status: valid.status,
        message: valid.msg,
      },
    });
  }
};

const deleteCommentAdmin = async (req, res, next) => {
  // admin for all delete
  if (req.user.role == "admin") {
    Comment.findByIdAndDelete(req.body.commentId).then((comment) => {
      if (comment) {
        console.log(comment);
        Product.findOneAndUpdate({
          $pull: { comments: req.body.commentId },
        }).then((product) => {
          if (product) {
            return res.status(200).json({ remove: comment });
          } else {
            return res.status(500).json({
              error: {
                status: 500,
                message: "not found comment in product",
              },
            });
          }
        });
      } else {
        return res.status(500).json({
          error: {
            status: 500,
            message: "not found comment",
          },
        });
      }
    });
  } else {
    // valid edit comment self
    const valid = await validSelfComment(req.body.commentId, req.user);
    if (valid.status === 200) {
      Comment.deleteOne({ _id: valid.res }).then((response) => {
        Product.findOneAndUpdate({
          $pull: { comments: req.body.commentId },
        }).then((response) => {
          // console.log("response product :", response);
          return res.status(valid.status).json({ remove: valid.comment });
        });
        // console.log("response comments", response);
      });
    } else {
      return res.status(valid.status).json({
        error: {
          status: valid.status,
          message: valid.msg,
        },
      });
    }
  }
};

// replay
const replyComment = async (req, res, next) => {
  const { productId, parentId, text, image } = req.body;
  const author = { id: req.user.id, username: req.user.username }; // create author
  const commentFinal = { author, parentId, text, image };
  try {
    const createComment = await Comment.create(commentFinal);
    const product = await Product.findByIdAndUpdate(
      productId,
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

/*********************** Functions *************************** */

const createParentComments = (comments, parentId = null) => {
  const commentList = [];
  let comment;

  if (!parentId) {
    comment = comments.filter((c) => c.parentId == undefined);
  } else {
    comment = comments.filter((c) => c.parentId == parentId);
  }

  for (let com of comment) {
    commentList.push({
      commentId: com._id,
      author: com.author,
      text: com.text,
      image: com.image,
      product: com.product,

      createdAt: com.createdAt,
      updatedAt: com.updatedAt,
      reply: createParentComments(comments, com._id),
    });
  }
  return commentList;
};

const validSelfComment = async (commentId, user) => {
  const comment = await Comment.findById(commentId);
  if (comment) {
    if (user.id === comment.author.id) {
      return { status: 200, res: commentId, comment: comment };
    } else {
      return {
        status: 500,
        msg: "You are not allowed to delete this comment",
      };
    }
  } else {
    return {
      status: 500,
      msg: "not Found comment",
    };
  }
};

module.exports = {
  getAllComments,
  createComment,
  getListProductComment,
  updateComment,
  replyComment,
  deleteCommentAdmin,
  deleteComment,
};
