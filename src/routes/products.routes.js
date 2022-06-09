const router = require("express").Router();
const Controllers = require("../controllers");
const {
  validateResultSchema
} = require("../middlewares/validRequestSchema");
const {
  verifyToken,
  verifySeller,
  verifyAdmin,
} = require("../middlewares/verifyToken.middlewares");
const upload = require("../middlewares/upload");

const {
  CreateProductSchema
} = require("../schema/productSchema");

router
  .route("/")
  .get(Controllers.Products.getAllProducts)
  .post(
    CreateProductSchema,
    validateResultSchema,
    verifySeller,
    Controllers.Products.createProduct
  ) // verify seller
  .put(verifySeller, Controllers.Products.updateProduct) // verify seller
  .delete(verifySeller, Controllers.Products.removeProduct); // verify seller

router.route("/:id").get(Controllers.Products.getSingleProduct);

// add image
router.route("/upload").put(verifyToken,verifySeller, upload.array('file', 3), Controllers.Products.addImageToProduct)
  .delete(verifyToken, verifySeller, Controllers.Products.deleteImageToProduct)

// comment
router
  .route("/comment")
  .get(verifyToken, verifyAdmin, Controllers.Comment.getAllComments) // verify (admin)
  .post(verifyToken, Controllers.Comment.createComment)
  .put(verifyToken, Controllers.Comment.updateComment) //comment all update
  .delete(verifyToken, Controllers.Comment.deleteComment); //  comment all delete

router
  .route("/comment/reply")
  .post(verifyToken, Controllers.Comment.replyComment); //  comment reply

router
  .route("/comment/:id")
  .get(verifyToken, Controllers.Comment.getListProductComment); // get comments from product

// tag
router
  .route("/tag")
  .get(Controllers.Tag.getAllTags)
  .post(verifyToken, verifySeller, Controllers.Tag.createTags); // verify admin & seller

module.exports = router;