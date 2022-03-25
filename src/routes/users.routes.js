const router = require("express").Router();
const Controllers = require("../controllers");
const { verifyToken } = require("../middlewares/verifyToken.middlewares");

router.route("/:id")
.get(verifyToken , Controllers.Users.getUser)
.put(verifyToken, Controllers.Users.updateUser);

router.route("/address/:id")
.get(verifyToken, Controllers.Users.getAddress)
.post(verifyToken, Controllers.Users.addAddress);

module.exports = router;
