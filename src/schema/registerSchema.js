const { body } = require("express-validator");

exports.schemaRegister = [
  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username must exist"),
  body("email")
    .isEmail()
    .withMessage("must contain a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters long"),
  body("phone").isNumeric(),
];
// module.exports = schema;
