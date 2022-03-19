const products = require('../models/products')

const getAllProducts = (req, res, next) => {
    res.json(products)
}

const getSingleProduct = (req, res, next) => {
    res.json(products.find((item) => item.id === req.params.id));
}

const addProduct = (req, res, next) => {
    const {
        id,
        title,
        price
    } = req.body

    const newProduct = {
        id: id,
        title: title,
        price: price
    }
    res.json({
        message: "product Created",
        product: newProduct
    })
}

exports.getAllProducts = getAllProducts
exports.getSingleProduct = getSingleProduct
exports.addProduct = addProduct