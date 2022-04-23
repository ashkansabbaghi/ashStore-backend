const Product = require("../db/models/Product.models");
const User = require("../db/models/User.models");
const Cart = require("../db/models/Cart.models");
const Order = require("../db/models/Order.models");
const Address = require("../db/models/Address.models");
const Blog = require("../db/models/Blog.models");
const Image = require("../db/models/Image.models");

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

  var final_img = {
    alt,
    image: {
      contentType: file.mimetype,
      data: fs.readFileSync(path.join("./upload/" + file.filename)),
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
};
