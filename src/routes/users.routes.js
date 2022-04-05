const router = require("express").Router();
const Controllers = require("../controllers");
const {
  verifyToken,
  verifyAdmin,
} = require("../middlewares/verifyToken.middlewares");
const { validateResultSchema } = require("../middlewares/validRequestSchema");
const {
  CreateAddressSchema,
  UpdateAddressSchema,
} = require("../schema/addressSchema");

// User
router.route("/").get(verifyAdmin, Controllers.Users.getAllUsers); //verify admin
router
  .route("/info/:id")
  .get(verifyToken, Controllers.Users.getUser)
  .put(verifyToken, Controllers.Users.updateUser)
  .delete(verifyToken, verifyAdmin, Controllers.Users.deleteUser);

// Address
router
  .route("/address")
  .get(verifyAdmin, Controllers.Address.getAllAddress) //verify admin
  .post(
    CreateAddressSchema,
    validateResultSchema,
    verifyToken,
    Controllers.Address.addAddress
  )
  .put(
    UpdateAddressSchema,
    validateResultSchema,
    verifyToken,
    Controllers.Address.updateAddress
  )
  .delete(verifyToken, Controllers.Address.deleteAddress);

router
  .route("/address/user")
  .get(verifyToken, Controllers.Address.getListUserAddress);

// comment
router
  .route("/comment")
  .get(verifyToken, verifyAdmin, Controllers.Comment.getAllComments) // verify (admin)
  .post(verifyToken, Controllers.Comment.createComment)
  .put(verifyToken, Controllers.Comment.updateComment) //comment all update
  .delete(verifyToken, Controllers.Comment.deleteComment) //  comment all delete


router
  .route("/comment/reply")
  .post(verifyToken, Controllers.Comment.replyComment); //  comment reply

router
  .route("/comment/:id")
  .get(verifyToken, Controllers.Comment.getListProductComment); // get comments from product




module.exports = router;
