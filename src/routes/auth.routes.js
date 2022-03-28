const router = require("express").Router();
const Controllers = require("../controllers");

router.route("/register").post(Controllers.Auth.register);
// router.route("/register/customer").post(Controllers.Auth.registerCustomer);
router.route("/login").post(Controllers.Auth.login);
// router.route("/login/customer").post(Controllers.Auth.loginCustomer);


module.exports = router;
