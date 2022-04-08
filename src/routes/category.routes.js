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
  .put(verifyToken, verifySeller, Controllers.Category.updateCategory) //comment all update
  .delete(verifyToken, verifySeller, Controllers.Category.deleteCategory); //  comment all delete

module.exports = router;
