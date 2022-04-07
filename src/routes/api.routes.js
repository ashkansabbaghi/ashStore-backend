const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./products.routes'));
router.use('/users', require('./users.routes'));
router.use('/comments', require('./comments.routes'));
router.use('/tags', require('./tags.routes'));

module.exports = router;
