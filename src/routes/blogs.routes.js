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
  .post(verifyToken, verifySeller, Controllers.Blog.addBlog)
  .delete(verifyToken, verifySeller, Controllers.Blog.deleteBlog)

  router
  .route("/:blogId")
  .get(verifyToken , verifySeller, Controllers.Blog.singleBlog)
  .put(verifyToken , verifySeller, Controllers.Blog.updateBlog)

router
  .route("/upload/")
  .post(verifyToken, verifySeller,upload.array('file', 3) ,Controllers.Blog.addImageToBlog)
  .delete(verifyToken, verifySeller,Controllers.Blog.deleteImageToBlog)

module.exports = router;
