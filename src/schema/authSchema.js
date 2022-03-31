const { body } = require("express-validator");

exports.registerSchema = [
  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username must exist"),
  body("email").isEmail().normalizeEmail().withMessage("must contain a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters long"),
  body("phone") .isLength({ min: 11 }).isNumeric().withMessage("The phone must be a number"),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("must contain a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters long"),
];
