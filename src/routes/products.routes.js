const router = require('express').Router();
const Controllers = require('../controllers');

router.route('/')
  .get(Controllers.Products.getAllProducts)
  .post(Controllers.Products.createProduct)
  .delete(Controllers.Products.removeProduct);

router.route('/:id')
  .get(Controllers.Products.getSingleProduct);

module.exports = router;
