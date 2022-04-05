const Comment = require("../db/models/Comment.models");
const Product = require("../db/models/Product.models");
const Tag = require("../db/models/Tag.models");

// promise function

const getAllTags = (req, res, next) => {
  Tag.find()
    .then((tags) => {
      return res.status(200).json(tags);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: {
          status: 500,
          message: "error sending tags",
        },
      });
    });
};

const createTags = (req, res, next) => {
  const { ...item } = req.body;
  Tag.create(item)
    .then((tags) => {
      return res.status(201).json(tags);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({
        error: {
          status: 500,
          message: "tag not create",
        },
      });
    });
};

// const getListProductComment = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("comments");
//     const comment = product.comments.map((comment) => {
//       return comment;
//     });
//     return res.status(200).json(comment);
//   } catch (e) {
//     return res.status(500).json({
//       error: {
//         status: 500,
//         message: "comments not found",
//       },
//     });
//   }
// };

// const updateComment = async (req, res, next) => {
//   try {
//     // console.log(req.body.commentId,  req.user);
//     const valid = await validSelfComment(req.body.commentId, req.user);
//     console.log("valid", valid);
//     if (valid.status === 200) {
//       const { commentId, ...item } = req.body; //remove id in body
//       console.log(item);
//       const updateComment = await Comment.findByIdAndUpdate(
//         req.body.commentId,
//         { $set: item },
//         { new: true }
//       );
//       console.log("update comment :", updateComment);
//       return res.status(valid.status).json(updateComment);
//     } else {
//       return res.status(valid.status).json(valid.msg);
//     }
//   } catch (e) {
//     return res.status(500).json({
//       error: {
//         status: 500,
//         message: "comment not updated",
//       },
//     });
//   }
// };

// const deleteComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findByIdAndDelete(req.body.commentId);
//     return res.status(200).json({ remove: comment });
//   } catch (e) {
//     return res.status(500).json({
//       error: {
//         status: 500,
//         message: "comment not deleted",
//       },
//     });
//   }
// };

// const deleteCommentSelf = async (req, res, next) => {
//   try {
//     const valid = await validSelfComment(req.body.commentId, req.user);
//     if (valid.status === 200) {
//       Comment.deleteOne({ _id: valid.res }).then((response) => {
//         Product.findOneAndUpdate({
//           $pull: { comments: req.body.commentId },
//         }).then((response) => {
//           // console.log("response product :", response);
//           return res.status(valid.status).json({ remove: valid.comment });
//         });
//         // console.log("response comments", response);
//       });
//     } else {
//       return res.status(valid.status).json({
//         error: {
//           status: valid.status,
//           message: valid.msg,
//         },
//       });
//     }
//   } catch (e) {
//     return res.status(500).json({
//       error: {
//         status: 500,
//         message: "comment not deleted",
//       },
//     });
//   }
// };

// // replay

// const replyComment = async (req, res, next) => {
//   const { productId, parentId, text, image } = req.body;
//   const author = { author: { id: req.user.id, username: req.user.username } }; // create author
//   const commentFinal = {
//     author,
//     parentId,
//     text,
//     image,
//   };
//   try {
//     const createComment = await Comment.create(commentFinal);
//     const product = await Product.findByIdAndUpdate(
//       productId,
//       { $push: { comments: createComment.id } },
//       { new: true, useFindAndModify: false }
//     );
//     return res.status(201).json(createComment);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({
//       error: {
//         status: 500,
//         message: "comment not created",
//       },
//     });
//   }
// };

// /*********************** Functions *************************** */

// const validSelfComment = async (commentId, user) => {
//   console.log(commentId);
//   const comment = await Comment.findById(commentId);
//   console.log("validSelfComment :", user, comment, commentId);
//   if (user.id === comment.author.id) {
//     return { status: 200, res: commentId, comment: comment };
//   } else {
//     return {
//       status: 500,
//       msg: "You are not allowed to delete this comment",
//     };
//   }
// };

module.exports = {
  getAllTags,
  createTags,
  //   getListProductComment,
  //   updateComment,
  //   deleteComment,
  //   deleteCommentSelf,
  //   replyComment,
};
