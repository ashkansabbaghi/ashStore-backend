const Products = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");
const User = require("../db/models/User.models");

const getAllProducts = async (req, res, next) => {
  const listProducts = await Products.find().exec();
  return res.json(listProducts);
};

const getSingleProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.findById(id);
  return res.json(product);
};

const createProduct = async (req, res, next) => {
  const { ...params } = req.body;
  const userId = req.user.id;
  try {
    const newProduct = await Products.create({ ...params });
    const seller = await AddProductToUser(userId, newProduct);
    return res.status(201).json({ newProduct , products : seller.products });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

const removeProduct = async (req, res, next) => {
  console.log(req.params);
  await Products.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(200).json(`delete ${product.name}`);
    }
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
  return Products.findByIdAndUpdate(
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
};
