const Products = require('../db/models/Product')

const getAllProducts = async (req, res, next) => {
    const listProducts = await Products.find().exec()
    res.json(listProducts)
}

const getSingleProduct = async (req, res, next) => {

    const id = req.params.id
    const product = await Products.findById(id)
    res.json(product)
}

const addProduct = async (req, res, next) => {
    const {
        title,
        price
    } = req.body

    const newProduct = new Products({
        title: title,
        price: price
    })

    await newProduct.save()

    res.status(201).json({
        message: "product Created",
        product: newProduct
    })
}

exports.getAllProducts = getAllProducts
exports.getSingleProduct = getSingleProduct
exports.addProduct = addProduct