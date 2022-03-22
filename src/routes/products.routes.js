const router = require('express').Router();
const Controllers = require('../controllers');

router.route('/products')
  .get(Controllers.Products.getAllProducts)
  .post(Controllers.Products.addProduct);

router.route('/product/:id')
  .get(Controllers.Products.getSingleProduct);

module.exports = router;
