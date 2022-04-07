const Product = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");
const User = require("../db/models/User.models");

const getAllProducts = async (req, res, next) => {
  try {
    const listProducts = await Product.find()
      .populate({ path: "tags", select: "-products -__v" })
      .exec();
    return res.status(200).json(listProducts);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "error sending products",
      },
    });
  }
};

const getSingleProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("auth");
    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "product not found",
      },
    });
  }
};

const createProduct = async (req, res, next) => {
  const { ...params } = req.body;
  const userId = req.user.id;
  try {
    const newProduct = await Product.create({ ...params });
    const auth = await AddProductToUser(userId, newProduct); // auth
    const product = await Product.findById(newProduct.id);
    return res.status(201).json({ product });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      error: {
        status: 500,
        message: "product not made",
      },
    });
  }
};

const updateProduct = async (req, res) => {
  const { id, ...item } = req.body;
  const productId = req.body.id;
  try {
    const upProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: item },
      { new: true }
    );
    return res.status(200).json(upProduct);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "product not updated",
      },
    });
  }
};

const removeProduct = (req, res, next) => {
  Product.findOneAndDelete({ _id: req.body.id }, (err, product) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json({
      error: {
        status: 500,
        message: "User could not be deleted",
      },
    });
  });
};

/******************************************** NOT EXPORT **************************************************** */
const AddProductToUser = (userId, product) => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { products: product } },
    { new: true, useFindAndModify: false }
  ).populate("products");
};

const createCategory = function (category) {
  return Category.create(category).then((docCategory) => {
    return docCategory;
  });
};
const addProductToCategory = function (tutorialId, categoryId) {
  return Product.findByIdAndUpdate(
    tutorialId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  removeProduct,
  createProduct,
  updateProduct,
};
