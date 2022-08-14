const { body } = require("express-validator");

exports.CreateAddressSchema = [
  body("country")
    .exists({ checkFalsy: true })
    .withMessage("country must exist"),

  body("state").exists({ checkFalsy: true }).withMessage("state must exist"),
  body("city").exists({ checkFalsy: true }).withMessage("city must exist"),
  body("street").exists({ checkFalsy: false }).withMessage("street must exist"),

  body("continueAddress")
    .exists({ checkFalsy: false })
    .withMessage("continueAddress must exist"),

  body("postCode")
    .exists({ checkFalsy: true })
    .isNumeric()
    .isLength({ min: 10 }),
];

exports.UpdateAddressSchema = [
  body("postCode")
    // .isNumeric()
];
