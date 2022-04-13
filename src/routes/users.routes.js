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

// cart
router
  .route("/cart/admin")
  .get(verifyToken, verifyAdmin, Controllers.Cart.getAllCart); //admin

router
  .route("/cart")
  .get(verifyToken, Controllers.Cart.getCartUser)
  .post(verifyToken, Controllers.Cart.addItemToCart)
  .delete(verifyToken, Controllers.Cart.removeItemInCart)

router
  .route("/cart/address")
  .post(verifyToken, Controllers.Cart.addAddressToCart);

router.route("/order").post(verifyToken, Controllers.Cart.getOrderStatusSeller);

module.exports = router;
