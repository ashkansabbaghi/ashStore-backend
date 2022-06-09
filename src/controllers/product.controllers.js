const Product = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");
const User = require("../db/models/User.models");
const Image = require("../db/models/Image.models");

const fs = require("fs");
const path = require("path");


const getAllProducts = async (req, res, next) => {
  try {
    const listProducts = await Product.find()
      .populate({
        path: "tags",
        select: "-products -__v"
      })
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
  const {
    id
  } = req.params;
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
  // const { ...params } = req.body;
  const productObj = req.body;
  productObj.auth = req.user.id;
  try {
    const newProduct = await Product.create(productObj);
    if (!newProduct)
      return res.status(500).send({
        error: {
          status: 500,
          message: "product not created"
        },
      });

    const auth = await AddProductToUser(req.user.id, newProduct); // auth
    if (!auth)
      return res.status(500).send({
        error: {
          status: 500,
          message: "product not add to user"
        },
      });

    return res
      .status(201)
      .json({
        status: true,
        products: newProduct.itemProductModel()
      });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      error: {
        status: 500,
        message: "product not made"
      },
    });
  }
};

const updateProduct = async (req, res) => {
  // const {
  //   id,
  //   ...item
  // } = req.body;
  const productId = req.body.productId;
  const name = req.body.name;
  const desc = req.body.desc;
  const price = req.body.price;
  const unit = req.body.unit;
  try {
    const upProduct = await Product.findByIdAndUpdate(
      productId, {
        $set: {
          name,
          desc,
          price,
          unit
        }
      }, {
        new: true
      }
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
  Product.findOneAndDelete({
    _id: req.body.id
  }, (err, product) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json({
      error: {
        status: 500,
        message: "User could not be deleted",
      },
    });
  });
};

const addImageToProduct = async (req, res, next) => {
  // console.log( req.files[0]);
  const productId = req.body.productId;
  let alt = req.body.alt;
  const file = req.files[0];

  const valid = ValidImage(file, alt);
  if (valid)
    return res.status(valid.status).json({
      status: false,
      message: valid.msg
    });

  var img = path.join("./public/products/" + file.filename);
  var final_img = {
    alt,
    image: {
      contentType: file.mimetype,
      data: img.toString("base64"),
    },
  };
  try {
    const newImage = await Image.create(final_img);
    if (!newImage)
      return res
        .status(500)
        .json({
          status: false,
          message: "Image not created"
        });

    console.log(newImage.id);

    const upImage = await Product.findByIdAndUpdate(
      productId, {
        $push: {
          image: newImage.id
        }
      }, {
        new: true
      }
    ).populate("image");

    console.log(upImage);
    if (!upImage)
      return res
        .status(500)
        .json({
          status: false,
          message: "Image not push in product"
        });

    return res
      .status(200)
      .json({
        status: true,
        message: "success",
        data: upImage
      });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e
    });
  }
};

const deleteImageToProduct = async (req, res,next) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product)
      res.status(200).json({
        status: false,
        message: "product not found"
      });

    console.log(product.image);
    if (!(product.image.length > 0)) {
      return res.status(500).json({
        status: false,
        message: "image not found in the product",
      });
    }
    const imageInProduct = product.image.find((id) => id == req.body.imageId);
    console.log(imageInProduct);
    if (!imageInProduct)
      return res.status(500).json({
        status: false,
        message: "This image does not exist on the product",
      });

    // delete id image to product
    const deleteImgToProduct = await product.updateOne({
      $pull: {
        image: req.body.imageId
      }
    }, {
      new: true
    });
    if (!deleteImgToProduct)
      return res
        .status(500)
        .json({
          status: false,
          message: "image not delete in product"
        });

    // // delete image
    const remove = await RemoveImage(imageInProduct);
    if (remove)
      return res
        .status(remove.status)
        .json({
          status: false,
          message: remove.message
        });

    return res
      .status(200)
      .json({
        status: true,
        message: "successful remove image"
      });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e
    });
  }
};

/******************************************** NOT EXPORT ****************************************** */
const ValidImage = (file, alt) => {
  // exist
  if (!file)
    return {
      status: 400,
      msg: "you must select a file",
    };
  if (!alt)
    return {
      status: 400,
      msg: "Enter alt",
    };

  // size 3mb
  if (file.size > (3 * 1000000))
    return {
      status: 400,
      msg: "File size is less than 3mb",
    };
};

const RemoveImage = async (imageId) => {
  // delete image
  const removeImage = await Image.findByIdAndRemove(imageId);
  if (!removeImage)
    return {
      status: 500,
      message: "image not delete in blog",
    };

  // delete local image
  fs.unlink(removeImage.image.data, (err) => {
    if (err)
      return {
        status: 500,
        message: `failed to delete local image: ${err}`,
      };
  });
};


const AddProductToUser = (userId, product) => {
  return User.findByIdAndUpdate(
    userId, {
      $push: {
        products: product
      }
    }, {
      new: true,
      useFindAndModify: false
    }
  ).populate("products");
};

const createCategory = function (category) {
  return Category.create(category).then((docCategory) => {
    return docCategory;
  });
};

const addProductToCategory = function (tutorialId, categoryId) {
  return Product.findByIdAndUpdate(
    tutorialId, {
      category: categoryId
    }, {
      new: true,
      useFindAndModify: false
    }
  );
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  removeProduct,
  createProduct,
  updateProduct,
  addImageToProduct,
  deleteImageToProduct
};