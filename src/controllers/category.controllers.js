const Comment = require("../db/models/Comment.models");
const Product = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");
const slugify = require("slugify");

const createCategory = async (req, res, next) => {
  const categoryObj = { title: req.body.title, slug: slugify(req.body.title) };
  try {
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
      const parent = await Category.findById(req.body.parentId);
      if (!parent)
        return res.status(500).json({
          error: { status: 500, message: "parentId not found" },
        });
    }
    const cat = new Category(categoryObj);
    cat.save((err, category) => {
      if (err) return res.status(500).json({ err });
      if (category) return res.status(201).json({ category });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "category not created",
      },
    });
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();
    console.log(categories);
    if (!categories)
      return res.status(500).json({
        error: {
          status: 500,
          message: "categories not found",
        },
      });

    const categoryList = createParentCategory(categories);
    return res.status(200).json(categoryList);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "error sending category",
      },
    });
  }
};

const updateCategory = async (req, res, next) => {
  const categoryObj = { title: req.body.title, slug: slugify(req.body.title) };
  try {
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId; // add to obj update
      const parent = await Category.findById(req.body.parentId);

      if (!parent)
        return res.status(500).json({
          error: { status: 500, message: "parentId not found" },
        });

      if (req.body.parentId === req.body.categoryId)
        return res.status(500).json({
          error: { status: 500, message: "A parent cannot be a child" },
        });
    }
    const updateCategory = await Category.findByIdAndUpdate(
      req.body.categoryId,
      { $set: categoryObj },
      { new: true }
    );
    if (updateCategory) {
      return res.status(200).json(updateCategory);
    } else {
      return res.status(500).json({
        error: {
          status: 500,
          message: "not found comment",
        },
      });
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

const deleteCategory = async (req, res, next) => {

}

/* ********************** NOT EXPORT ***************************** */

const createParentCategory = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (!parentId) {
    category = categories.filter((c) => c.parentId == undefined);
  } else {
    category = categories.filter((c) => c.parentId == parentId);
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      title: cat.title,
      slug: cat.slug,
      children: createParentCategory(categories, cat._id),
    });
  }
  return categoryList;
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

// const deleteComment = async (req, res, next) => {
//   // admin for all delete
//   if (req.user.role == "admin") {
//     Comment.findByIdAndDelete(req.body.commentId).then((comment) => {
//       if (comment) {
//         console.log(comment);
//         Product.findOneAndUpdate({
//           $pull: { comments: req.body.commentId },
//         }).then((product) => {
//           if (product) {
//             return res.status(200).json({ remove: comment });
//           } else {
//             return res.status(500).json({
//               error: {
//                 status: 500,
//                 message: "not found comment in product",
//               },
//             });
//           }
//         });
//       } else {
//         return res.status(500).json({
//           error: {
//             status: 500,
//             message: "not found comment",
//           },
//         });
//       }
//     });
//   } else {
//     // valid edit comment self
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
//   }
// };

// // replay
// const replyComment = async (req, res, next) => {
//   const { productId, parentId, text, image } = req.body;
//   const author = {   id: req.user.id, username: req.user.username  }; // create author
//   const commentFinal = { author, parentId, text, image };
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
//   // console.log(commentId);
//   const comment = await Comment.findById(commentId);
//   if (comment) {
//     // console.log("validSelfComment :", user, comment, commentId);
//     if (user.id === comment.author.id) {
//       return { status: 200, res: commentId, comment: comment };
//     } else {
//       return {
//         status: 500,
//         msg: "You are not allowed to delete this comment",
//       };
//     }
//   } else {
//     return {
//       status: 500,
//       msg: "not Found comment",
//     };
//   }
// };

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  // createComment,
  // getListProductComment,
  // updateComment,
  // deleteComment,
  // replyComment,
};
