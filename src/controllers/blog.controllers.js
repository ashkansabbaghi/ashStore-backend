const Product = require("../db/models/Product.models");
const User = require("../db/models/User.models");
const Cart = require("../db/models/Cart.models");
const Order = require("../db/models/Order.models");
const Address = require("../db/models/Address.models");
const Blog = require("../db/models/Blog.models");
const Image = require("../db/models/Image.models");
const Category = require("../db/models/Category.models");

const slugify = require("slugify");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getAllBlogs = async (req, res) => {
  try {
    Blog.find()
      .populate("category")
      .exec((err, blog) => {
        if (err) return res.status(500).json({ status: false, message: err });
        console.log(blog.length);
        if (blog.length < 1)
          return res
            .status(500)
            .json({ status: false, message: "Blog not found" });

        const blogCustom = blog.map((b) => b.itemBlogModel());

        return res.status(200).json({
          status: true,
          message: "get data blogs",
          data: blogCustom,
        });
      });
  } catch (e) {
    console.log(e);
  }
};

const addBlog = async (req, res) => {
  const blogObj = req.body;
  const auth = req.user.id;
  blogObj.auth = auth; // add auth
  blogObj.slug = slugify(req.body.title);

  console.log(blogObj);
  try {
    const newBlog = await Blog.create(blogObj);
    if (!newBlog)
      return res
        .status(400)
        .json({ status: false, message: "blog not created" });

    return res.status(200).json({
      status: true,
      message: "success created",
      data: newBlog.itemBlogModel(),
    });
  } catch (e) {
    return res.status(400).json({ status: false, message: e });
  }
};

const addImageToBlog = async (req, res, next) => {
  const file = req.files[0];
  const blogId = req.body.blogId;
  let alt = req.body.alt;

  const valid = ValidImage(file, alt);
  if (valid)
    return res.status(valid.status).json({ status: false, message: valid.msg });
  console.log(file.filename);
  var img = path.join("./public/upload/" + file.filename);
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
        .json({ status: false, message: "Image not created" });

    console.log(newImage.id);

    const upImage = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { image: newImage.id } },
      { new: true }
    );
    if (!upImage)
      return res
        .status(500)
        .json({ status: false, message: "Image not push in blog" });

    return res
      .status(200)
      .json({ status: true, message: "success", data: upImage });
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};

const deleteImageToBlog = async (req, res) => {
  try {
    // find image
    console.log(req.body.imageId);
    const image = await Image.findById(req.body.imageId);
    if (!image)
      return res
        .status(500)
        .json({ status: false, message: "image not found" });

    console.log("find image", image.image.data);

    // delete id image to blog
    const imgToBlog = await Blog.findByIdAndUpdate(
      req.body.blogId,
      { $pull: { image: req.body.imageId } },
      { new: true }
    );
    if (!imgToBlog)
      return res
        .status(500)
        .json({ status: false, message: "image not delete in blog" });

    console.log("delete id image to blog");

    // delete image
    const removeImage = await image.remove();
    if (!removeImage)
      return res
        .status(500)
        .json({ status: false, message: "image not delete in blog" });

    console.log("delete image");

    // delete local image
    fs.unlink(image.image.data, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        return res
          .status(500)
          .json({ status: false, message: "successful remove image" });
      }
    });
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};

const singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog)
      return res.status(500).json({ status: false, message: "blog not found" });

    return res.status(500).json({
      status: true,
      message: "single blog",
      data: blog.itemBlogModel(),
    });
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};

const updateBlog = async (req, res) => {
  try {
    console.log(req.params.blogId);
    const { category, title, content, published } = req.body;

    if (category) {
      const cat = await Category.findById(category);
      if (!cat)
        return res
          .status(500)
          .json({ status: false, message: "category not found" });
    }
    const obj = {
      category,
      title,
      slug: slugify(title),
      content,
      published,
    };

    const update = await Blog.findByIdAndUpdate(
      req.params.blogId,
      { $set: obj },
      { new: true }
    );

    if (!update)
      return res
        .status(404)
        .json({ status: false, message: "update blog not found" });

    return res
      .status(404)
      .json({ status: false, message: "update blog", data: update });
  } catch (e) {
    return res.status(500).json({ status: false, message: e });
  }
};

/* *************************************** */

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

  // size 1mb
  if (file.size > 3000000)
    return {
      status: 400,
      msg: "File size is less than 3mb",
    };
};

module.exports = {
  getAllBlogs,
  addBlog,
  addImageToBlog,
  deleteImageToBlog,
  singleBlog,
  updateBlog,
};
