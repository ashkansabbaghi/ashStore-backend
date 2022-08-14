const router = require("express").Router();
const Controllers = require("../controllers");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const {
  verifyToken,
  verifySeller,
  verifyAdmin,
} = require("../middlewares/verifyToken.middlewares");

const { CreateProductSchema } = require("../schema/productSchema");

// comment
router
  .route("/")
  .get(verifyToken, verifyAdmin, Controllers.Comment.getAllComments) // verify (admin)
  .post(verifyToken, Controllers.Comment.createComment)
  .put(verifyToken, Controllers.Comment.updateComment) //comment all update
  .delete(verifyToken,Controllers.Comment.deleteComment); //  user


router
  .route("/reply")
  .post(verifyToken, Controllers.Comment.replyComment); //  comment reply

router
  .route("/product")
  .post(verifyToken, Controllers.Comment.getListProductComment); // get comments from product

router
  .route("/delete")
  .delete(verifyToken,verifyAdmin ,Controllers.Comment.deleteCommentAdmin); //  (admin)




module.exports = router;
