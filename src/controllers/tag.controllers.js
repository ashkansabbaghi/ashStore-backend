const { update } = require("../db/models/Product.models");
const Product = require("../db/models/Product.models");
const Tag = require("../db/models/Tag.models");
const slugify = require("slugify")

// promise function

const getAllTags = (req, res, next) => {
  Tag.find()
    .then((tags) => {
      return res.status(200).json(tags);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: {
          status: 500,
          message: "error sending tags",
        },
      });
    });
};

const createTags = (req, res, next) => {
  const title = req.body.title;
  // const slug = title.replace(/\s*-\s*/g, "-").replace(/[^-\w]+/g, "_");
  const slug = slugify(req.body.title);
  Tag.create({ title, slug })
    .then((tags) => {
      return res.status(201).json(tags);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({
        error: {
          status: 500,
          message: "tag not create",
        },
      });
    });
};

// objective function

const setTagAndProduct = async (req, res, next) => {
  const { productId, tagId } = req.body;
  try {
    const product = await Product.findById(productId).populate(
      "tags",
      "-products -__v"
    );
    const tag = await Tag.findById(tagId);
    console.log(product, tag);
    if (!product)
      return res
        .status(500)
        .json({ error: { status: 500, message: "product not found" } });

    if (!tag)
      return res
        .status(500)
        .json({ error: { status: 500, message: "tag not found" } });

    const findTag = product.tags.find((t) => t.toString() === tag.id);

    if (findTag)
      return res.status(500).json({
        error: {
          status: 500,
          message: "This tag has already been used in this product",
        },
      }); // check find tag in product

    if (product.tags.length >= 5)
      return res.status(500).json({
        error: {
          status: 500,
          message: "You can not use more than 5 tags",
        },
      }); // check length 5 tag in product
    product.tags.push(tag.id);
    tag.products.push(product.id);

    await product.save();
    await tag.save();

    return res.status(200).json({ product });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: { status: 500, message: "not found" } });
  }
};

const unSetTagAndProduct = async (req, res, next) => {
  const { productId, tagId } = req.body;
  try {
    const product = await Product.findById(productId);
    const tag = await Tag.findById(tagId);
    if (!(product && tag))
      return res
        .status(500)
        .json({ error: { status: 500, message: "tag or product not found" } });

    const findTagWithProduct = product.tags.find(
      (t) => t.toString() === tag.id
    );
    const findProductWithTag = tag.products.find(
      (p) => p.toString() === product.id
    );
    console.log(findTagWithProduct, findProductWithTag);

    if (!(findTagWithProduct && findProductWithTag))
      return res.status(500).json({
        error: {
          status: 500,
          message: "They are not set",
        },
      });

    product.tags.pull(tag.id);
    tag.products.pull(product.id);

    await product.save();
    await tag.save();

    return res.status(200).json({ product });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: { status: 500, message: "not found" } });
  }
};

const updateTag = async (req, res, next) => {
  try {
    const { tagId, title } = req.body;
    const slug = title.replace(/\s*-\s*/g, "-").replace(/[^-\w]+/g, "_");
    const updateTag = await Tag.findByIdAndUpdate(
      tagId,
      { $set: { slug, title } },
      { new: true }
    );
    return res.status(200).json(updateTag);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "tag not updated",
      },
    });
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tagId = req.body.tagId;
    const tag = await Tag.findById(tagId);
    if (!tag)
      return res
        .status(500)
        .json({ error: { status: 404, message: "tag dose not exist" } });

    console.log("before if", tag.products);
    if (tag.products.length > 0) {
      const listProductId = tag.products;
      const numProducts = listProductId.length;
      console.log("after if", numProducts);

      for (let i = 0; i < numProducts; i++) {
        console.log(listProductId[i].toString());
        const product = await Product.findByIdAndUpdate(
          listProductId[i].toString(),
          {
            $pull: { tags: tagId },
          }
        );
      }
      const deleteTag = await tag.deleteOne({ id: tagId });
      return res
        .status(200)
        .json({ remove: deleteTag, products: tag.products });
    } else return res.status(200).json({ remove: tag });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "tag not deleted",
      },
    });
  }
};

const getListTagsInProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId).populate("tags");
    const tags = product.tags;
    if (!tags)
      return res
        .status(500)
        .json({ error: { status: 500, message: "The list is empty" } });

    return res.status(200).json(tags);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: { status: 500, message: "tags not found" } });
  }
};

module.exports = {
  getAllTags,
  createTags,
  setTagAndProduct,
  updateTag,
  deleteTag,
  unSetTagAndProduct,
  getListTagsInProducts,
  //   getListProductComment,
  //   updateComment,
  //   deleteComment,
  //   deleteCommentSelf,
  //   replyComment,
};
