const router = require('express').Router();
const authController = require('../controllers/auth-controllers')
const {verifyToken} = require('../controllers/verifyToken')


router.post('/register' , authController.register)
router.post('/login' , authController.login)
router.post('/:id' , verifyToken , (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString()
    }
})

module.exports = router