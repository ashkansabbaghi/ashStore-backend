const router = require('express').Router();
const Controllers = require('../controllers');
const { verifyToken } = require('../middlewares/verifyToken.middlewares');

router.route('/user/:id')
  .put(verifyToken, Controllers.Users.updateUser);

module.exports = router;
