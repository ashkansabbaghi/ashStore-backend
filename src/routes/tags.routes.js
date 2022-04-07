const router = require("express").Router();
const Controllers = require("../controllers");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const {
  verifyToken,
  verifySeller,
  verifyAdmin,
} = require("../middlewares/verifyToken.middlewares");

const { CreateProductSchema } = require("../schema/productSchema");

// tag
router
  .route("/")
  .get(Controllers.Tag.getAllTags)
  .post(verifyToken, verifySeller, Controllers.Tag.createTags) // verify admin & seller
  .put(verifyToken, verifySeller, Controllers.Tag.updateTag)
  .delete(verifyToken, verifySeller, Controllers.Tag.deleteTag);

router.route("/product").post(verifyToken, Controllers.Tag.getListTagsInProducts);

router
  .route("/set")
  .post(verifyToken, verifySeller, Controllers.Tag.setTagAndProduct); // verify admin & seller

router
  .route("/unset")
  .post(verifyToken, verifySeller, Controllers.Tag.unSetTagAndProduct); // verify admin & seller

module.exports = router;
