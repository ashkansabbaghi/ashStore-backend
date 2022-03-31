const router = require("express").Router();
const Controllers = require("../controllers");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const { registerSchema, loginSchema } = require("../schema/authSchema");

router
  .route("/register")
  .post(registerSchema, validateResultSchema, Controllers.Auth.register);
router
  .route("/login")
  .post(loginSchema, validateResultSchema, Controllers.Auth.login);

module.exports = router;
