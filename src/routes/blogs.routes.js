const router = require("express").Router();
const Controllers = require("../controllers");
const {
  verifyToken,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/verifyToken.middlewares");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const {
  CreateAddressSchema,
  UpdateAddressSchema,
} = require("../schema/addressSchema");

const upload = require("../middlewares/upload");

// User
router
  .route("/")
  .get(Controllers.Blog.getAllBlogs) //verify admin
  .post(verifyToken, verifySeller, Controllers.Blog.addBlog);

router
  .route("/upload/")
  .post(verifyToken, verifySeller,upload.array('file', 3) ,Controllers.Blog.addImageToBlog)
  .delete(verifyToken, verifySeller,Controllers.Blog.deleteImageToBlog)

module.exports = router;
