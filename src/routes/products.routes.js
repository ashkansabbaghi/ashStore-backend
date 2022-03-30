const router = require("express").Router();
const Controllers = require("../controllers");
const {
  verifyToken,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/verifyToken.middlewares");

router
  .route("/")
  .get(Controllers.Products.getAllProducts)
  .post(verifySeller, Controllers.Products.createProduct) // verify seller
  .delete(verifySeller, Controllers.Products.removeProduct); // verify seller

router.route("/:id").get(Controllers.Products.getSingleProduct);

module.exports = router;
