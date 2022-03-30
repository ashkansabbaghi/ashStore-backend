const router = require("express").Router();
const Controllers = require("../controllers");
const {validateResultSchema} = require("../middlewares/validRequestSchema")
const {schemaRegister} = require("../schema/registerSchema")

router.route("/register").post(schemaRegister,validateResultSchema,Controllers.Auth.register);
router.route("/login").post(Controllers.Auth.login);


module.exports = router;
