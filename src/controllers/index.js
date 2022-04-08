const Products = require("./product.controllers");
const Auth = require("./auth.controllers");
const Users = require("./users.controllers");
const Address = require("./address.controllers");
const Comment = require("./comment.controllers");
const Tag = require("./tag.controllers.js");
const Category = require("./category.controllers.js");
module.exports = {
  Products,
  Auth,
  Users,
  Address,
  Comment,
  Tag,
  Category,
};
