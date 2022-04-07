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
  .delete(verifyToken, Controllers.Comment.deleteComment); //  comment all delete

router
  .route("/reply")
  .post(verifyToken, Controllers.Comment.replyComment); //  comment reply

router
  .route("/:id")
  .get(verifyToken, Controllers.Comment.getListProductComment); // get comments from product

// tag
router
  .route("/tag")
  .get(Controllers.Tag.getAllTags)
  .post(verifyToken, verifySeller, Controllers.Tag.createTags); // verify admin & seller

module.exports = router;
