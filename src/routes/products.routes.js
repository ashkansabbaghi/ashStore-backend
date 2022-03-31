const router = require("express").Router();
const Controllers = require("../controllers");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const { verifySeller } = require("../middlewares/verifyToken.middlewares");

const { CreateProductSchema } = require("../schema/productSchema");

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
  .delete(verifySeller, Controllers.Products.removeProduct) // verify seller

router.route("/:id").get(Controllers.Products.getSingleProduct);

module.exports = router;
