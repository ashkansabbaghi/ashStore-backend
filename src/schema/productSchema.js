const { body } = require("express-validator");

exports.CreateProductSchema = [
  body("name").exists({ checkFalsy: true }).withMessage("Username must exist"),
  body("desc").exists({ checkFalsy: true }).withMessage("desc must exist"),
  body("unit")
    .exists({ checkFalsy: true })
    .withMessage("unit must exist")
    .isNumeric(),
  body("price")
    .exists({ checkFalsy: true })
    .withMessage("unit must exist")
    .isNumeric(),

];
