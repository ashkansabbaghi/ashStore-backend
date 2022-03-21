const router = require('express').Router();
const authController = require('../controllers/auth-controllers')
const {
    verifyToken
} = require('../controllers/verifyToken')


router.post('/register', authController.register)
router.post('/login', authController.login)
router.put('/user/:id', verifyToken, authController.updateUser)

module.exports = router