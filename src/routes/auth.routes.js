const router = require("express").Router();
const Controllers = require("../controllers");

router.route("/register").post(Controllers.Auth.register);
router.route("/login").post(Controllers.Auth.login);


module.exports = router;
