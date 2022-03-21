const User = require('../db/models/User')
const CryptoJS = require('crypto-js')

// REGISTER
const register = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        phone: req.body.phone
    })

    try {
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (e) {
        res.status(500).json(e)
    }
}

// LOGIN
const login = async (req, res) => {}

exports.register = register
exports.login = login