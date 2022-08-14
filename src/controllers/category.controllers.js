const Product = require("../db/models/Product.models");
const Category = require("../db/models/Category.models");
const slugify = require("slugify");

const createCategory = async (req, res, next) => {
  const categoryObj = { title: req.body.title, slug: slugify(req.body.title) };
  try {
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
      const parent = await Category.findById(req.body.parentId);
      if (!parent)
        return res.status(500).json({
          status: false,
          message: "parentId not found",
        });
    }
    const cat = new Category(categoryObj);
    cat.save((err, category) => {
      if (err) return res.status(500).json({ err });
      if (category)
        return res.status(201).json({
          status: true,
          message: "create category",
          data: category.itemCategoryModel(),
        });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "category not created",
    });
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length < 1)
      return res.status(500).json({
        status: false,
        message: "categories not found",
      });
    const checkDeleteSeller = categories.filter(
      (category) => category.isDelete === false
    );

    const categoryList = createParentCategory(checkDeleteSeller);
    return res
      .status(200)
      .json({ status: true, message: "get all category", data: categoryList });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "error sending category",
    });
  }
};

const updateCategory = async (req, res, next) => {
  const categoryObj = { title: req.body.title, slug: slugify(req.body.title) };
  try {
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId; // add to obj update
      const parent = await Category.findById(req.body.parentId);

      if (!parent)
        return res.status(500).json({
          error: { status: false, message: "parentId not found" },
        });

      if (req.body.parentId === req.body.categoryId)
        return res.status(500).json({
          status: false,
          message: "A parent cannot be a child",
        });
    }
    const updateCategory = await Category.findByIdAndUpdate(
      req.body.categoryId,
      { $set: categoryObj },
      { new: true }
    );
    if (updateCategory) {
      return res.status(200).json({
        status: true,
        message: "update category",
        data: updateCategory.itemCategoryModel(),
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "not found category",
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "comment not updated",
    });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.body.categoryId;
  try {
    const deleteCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: { isDelete: true } },
      { new: true }
    );
    if (!deleteCategory)
      return res
        .status(500)
        .json({ error: { status: false, message: "Category  not found" } });

    return res.status(200).json({
      status: true,
      message: "delete category seller",
      data: deleteCategory.itemCategoryModel(),
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Category could not be deleted",
    });
  }
};

const recoveryCategory = async (req, res) => {
  const categoryId = req.body.categoryId;
  try {
    const recovery = await Category.findByIdAndUpdate(
      categoryId,
      { $set: { isDelete: false } },
      { new: true }
    );
    if (!recovery)
      return res
        .status(500)
        .json({ error: { status: false, message: "Category  not found" } });

    return res.status(200).json({
      status: true,
      message: "recovery category",
      data: recovery.itemCategoryModel(),
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Category could not be recovery",
    });
  }
};

const deleteCategoryAdmin = async (req, res, next) => {
  const categoryId = req.body.categoryId;
  try {
    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if (!deleteCategory)
      res.status(500).json({
        status: false,
        message: "not found category for delete",
      });

    res
      .status(200)
      .json({ status: true, message: "delete category", data: deleteCategory });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "not delete category",
    });
  }
};

const setCategoryToProduct = async (req, res) => {
  const { productId, categoryId } = req.body;
  try {
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(500).json({
        status: false,
        message: "category not found",
      });

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { category: categoryId } },
      { new: true }
    );
    if (!product)
      return res.status(500).json({
        status: false,
        message: "product not found",
      });

    return res.status(200).json({
      status: true,
      message: "set category to product",
      data: product,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "not set category to product",
    });
  }
};

const unSetCategoryToProduct = async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { category: null } },
      { new: true }
    );
    if (!product)
      return res.status(500).json({
        status: false,
        message: "product not found",
      });

    return res.status(200).json({
      status: true,
      message: "unset category to product",
      data: product,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "not set category to product",
    });
  }
};

/* ********************** NOT EXPORT ***************************** */

const createParentCategory = (categories, parentId = null) => {
  const categoryList = [];
  let category;

  if (!parentId) {
    category = categories.filter((c) => c.parentId == undefined);
  } else {
    category = categories.filter((c) => c.parentId == parentId);
  }

  for (let cat of category) {
    categoryList.push({
      categoryId: cat._id,
      title: cat.title,
      slug: cat.slug,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      children: createParentCategory(categories, cat._id),
    });
  }
  return categoryList;
};

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAdmin,
  recoveryCategory,
  setCategoryToProduct,
  unSetCategoryToProduct,
};
