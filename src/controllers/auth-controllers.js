const User = require('../db/models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// REGISTER
const register = async (req, res) => {
    const {
        username,
        email,
        password,
        phone
    } = req.body

        !(email && username && phone && password) &&
        res.status(400).json("All input is required") // check empty input

    await User.findOne({
        username
    }) && res.status(409).json("This username exists !")

    await User.findOne({
        email
    }) && res.status(409).json("There is a user with this email !")

    const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
        phone: phone
    })

    try {
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (e) {
        res.status(500).json(e)
    }
}

// LOGIN
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });

        !user && res.status(401).json("Wrong Credentials !") //check existing user

        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const OrgPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        OrgPassword !== req.body.password && res.status(401).json("Wrong Credentials !") //check existing user

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.TOKEN_SEC, {
            expiresIn: "3d"
        })

        const {
            password,
            isAdmin,
            ...customUser
        } = user._doc //remove (password ans isAdmin) from user

        res.status(200).json({...customUser,token :accessToken })

    } catch (e) {
        res.status(500).json(e)
    }
}

exports.register = register
exports.login = login