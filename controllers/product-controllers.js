const products = require('../models/products')

const getAllProducts = (req, res, next) => {
    res.json(products)
}

const getSingleProduct = (req, res, next) => {
    const product = products.find((item) => item.id === req.params.id);
    console.log(product)
    res.json(product);

}

const addProduct = (req, res, next) => {
    const {id ,title , price } = req.body

    const newProduct  = {id : id, title : title, price : price}
    res.json({message : "product Created"})
}

exports.getAllProducts = getAllProducts
exports.getSingleProduct = getSingleProduct
exports.addProduct = addProduct