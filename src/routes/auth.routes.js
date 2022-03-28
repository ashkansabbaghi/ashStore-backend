const router = require("express").Router();
const Controllers = require("../controllers");

router.route("/register").post(Controllers.Auth.register);
router.route("/register/customer").post(Controllers.Auth.registerCustomer);
router.route("/login").post(Controllers.Auth.login);

module.exports = router;
