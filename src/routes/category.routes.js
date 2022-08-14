const router = require("express").Router();
const Controllers = require("../controllers");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const {
  verifyToken,
  verifySeller,
  verifyAdmin,
} = require("../middlewares/verifyToken.middlewares");

const { CreateProductSchema } = require("../schema/productSchema");

// category
router
  .route("/")
  .get(Controllers.Category.getAllCategory) // verify (admin)
  .post(verifyToken, verifySeller, Controllers.Category.createCategory)
  .put(verifyToken, verifySeller, Controllers.Category.updateCategory)
  .delete(verifyToken, verifySeller, Controllers.Category.deleteCategory); // seller

router
  .route("/delete")
  .delete(verifyToken, verifyAdmin, Controllers.Category.deleteCategoryAdmin); //  admin delete

router
  .route("/recovery")
  .post(verifyToken, verifyAdmin, Controllers.Category.recoveryCategory); //  admin recovery

router
  .route("/set")
  .post(verifyToken, verifySeller, Controllers.Category.setCategoryToProduct); //  seller

router
  .route("/unset")
  .post(verifyToken, verifySeller, Controllers.Category.unSetCategoryToProduct); //  seller

module.exports = router;
