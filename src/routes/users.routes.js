const router = require("express").Router();
const Controllers = require("../controllers");
const { verifyToken } = require("../middlewares/verifyToken.middlewares");
// User
router.route("/").get(Controllers.Users.getAllUsers); //verify admin
router
  .route("/info/:id")
  .get(verifyToken, Controllers.Users.getUser)
  .put(verifyToken, Controllers.Users.updateUser)
  .delete(verifyToken, Controllers.Users.deleteUser);

// Address
router.route("/address").get(Controllers.Address.getAllAddress); //verify admin
router
  .route("/address/:id")
  .get(verifyToken, Controllers.Address.getListUserAddress)
  .post(verifyToken, Controllers.Address.addAddress)
  .put(verifyToken, Controllers.Address.updateAddress)
  .delete(Controllers.Address.deleteAddress);

module.exports = router;
