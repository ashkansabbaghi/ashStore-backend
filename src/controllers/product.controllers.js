const Products = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");

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
  //   const { name, desc, unit, price, startAt, endAt } = req.body;
  const { ...params } = req.body;
  console.log(params);
  const newProduct = new Products({ ...params });

  try {
    await newProduct.save();
    return res.status(201).json({ ...newProduct.itemProductModel() });
  } catch (e) {
    // console.log(e);
    return res.status(500).send(e);
  }
};

const removeProduct = async (req, res, next) => {
  console.log(req.body);
  await Products.findByIdAndDelete(req.body, (err, product) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(200).json(`delete ${product.name}`);
    }
  });
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
