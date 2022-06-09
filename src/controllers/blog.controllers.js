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
      .populate("category image")
      .exec((err, blog) => {
        if (err) return res.status(500).json({
          status: false,
          message: err
        });
        console.log(blog.length);
        if (blog.length < 1)
          return res
            .status(500)
            .json({
              status: false,
              message: "Blog not found"
            });

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
        .json({
          status: false,
          message: "blog not created"
        });

    return res.status(200).json({
      status: true,
      message: "success created",
      data: newBlog.itemBlogModel(),
    });
  } catch (e) {
    return res.status(400).json({
      status: false,
      message: e
    });
  }
};

const deleteBlog = async (req, res) => {
  // find images
  try {
    const blog = await Blog.findById(req.body.blogId);
    if (!blog)
      return res.status(500).json({
        status: false,
        message: "blog not found"
      });

    if (blog.image.length > 0) {
      for (var i = 0; i < blog.image.length; i++) {
        console.log(blog.image[i]);
        const remove = RemoveImage(blog.image[i]);
        if (!remove)
          return res
            .status(remove.status)
            .json({
              status: false,
              message: remove.message
            });
      }
    }
    const removeBlog = blog.remove();
    if (!removeBlog)
      return res.status(500).json({
        status: false,
        message: "The blog could not be removed",

      });

    return res.status(200).json({
      status: true,
      message: "successful removed",
      data: blog.itemBlogModel(),
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: false,
      message: e
    });
  }
};

const addImageToBlog = async (req, res, next) => {
  const file = req.files[0];
  const blogId = req.body.blogId;
  let alt = req.body.alt;
  console.log(file);

  const valid = ValidImage(file, alt);
  if (valid)
    return res.status(valid.status).json({
      status: false,
      message: valid.msg
    });
  console.log(file.filename);
  // var img = path.join("./public/upload/" + file.filename);
const img = file.filename
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

    // console.log(newImage);

    const upImage = await Blog.findByIdAndUpdate(
      blogId, {
        $push: {
          image: newImage.id
        }
      }, {
        new: true
      }
    ).populate("image");
    if (!upImage)
      return res
        .status(500)
        .json({
          status: false,
          message: "Image not push in blog"
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

const deleteImageToBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.body.blogId);
    if (!blog)
      res.status(200).json({
        status: false,
        message: "blog not found"
      });

    console.log(blog.image);
    if (!(blog.image.length > 0)) {
      return res.status(500).json({
        status: false,
        message: "image not found in the blog",
      });
    }
    const imageInBlog = blog.image.find((id) => id == req.body.imageId);
    console.log(imageInBlog);
    if (!imageInBlog)
      return res.status(500).json({
        status: false,
        message: "This image does not exist on the blog",
      });

    // delete id image to blog
    const deleteImgToBlog = await blog.updateOne({
      $pull: {
        image: req.body.imageId
      }
    }, {
      new: true
    });
    if (!deleteImgToBlog)
      return res
        .status(500)
        .json({
          status: false,
          message: "image not delete in blog"
        });

    // // delete image
    const remove = await RemoveImage(imageInBlog);
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

const singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog)
      return res.status(500).json({
        status: false,
        message: "blog not found"
      });

    return res.status(500).json({
      status: true,
      message: "single blog",
      data: blog.itemBlogModel(),
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    console.log(req.params.blogId);
    const {
      category,
      title,
      content,
      published
    } = req.body;

    if (category) {
      const cat = await Category.findById(category);
      if (!cat)
        return res
          .status(500)
          .json({
            status: false,
            message: "category not found"
          });
    }
    const obj = {
      category,
      title,
      slug: slugify(title),
      content,
      published,
    };

    const update = await Blog.findByIdAndUpdate(
      req.params.blogId, {
        $set: obj
      }, {
        new: true
      }
    );

    if (!update)
      return res
        .status(404)
        .json({
          status: false,
          message: "update blog not found"
        });

    return res
      .status(404)
      .json({
        status: false,
        message: "update blog",
        data: update
      });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e
    });
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

module.exports = {
  getAllBlogs,
  addBlog,
  deleteBlog,
  addImageToBlog,
  deleteImageToBlog,
  singleBlog,
  updateBlog,
};