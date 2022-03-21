const router = require('express').Router();
const productController = require('../controllers/product-controllers')

router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getSingleProduct)
router.post('/add-product', productController.addProduct)


module.exports = router