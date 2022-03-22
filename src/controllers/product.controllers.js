const Products = require('../db/models/Product.models');

const getAllProducts = async (req, res, next) => {
	const listProducts = await Products.find().exec();
	return res.json(listProducts);
};

const getSingleProduct = async (req, res, next) => {
	const { id } = req.params;
	const product = await Products.findById(id);
	return res.json(product);
};

const addProduct = async (req, res, next) => {
	const { title, price } = req.body;

	const newProduct = new Products({
		title,
		price,
	});

	await newProduct.save();

	return res.status(201).json({
		message: 'product Created',
		product: newProduct,
	});
};

module.exports = {
	getAllProducts,
	getSingleProduct,
	addProduct,
};
