const User = require("../db/models/User.models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//TODO: bcrypt (hash pass)
//TODO: : https://www.npmjs.com/package/passport

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!(email && username && phone && password))
      return res.status(400).json("All input is required"); // check empty input

    if (await User.findOne({ username }))
      return res.status(409).json("This username exists !"); // ! return & try/catch

    if (await User.findOne({ email }))
      return res.status(409).json("There is a user with this email !");

    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUND);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      phone,
      email: email.toLowerCase(),
      // password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
      salt,
      hashedPassword,
    });

    const saveUser = await newUser.save();
    return res.status(201).json(saveUser);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) return res.status(401).json("Wrong Credentials !"); //check existing user

    // const hashedPass = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SEC
    // );
    // const OrgPassword = hashedPass.toString(CryptoJS.enc.Utf8);

    // if (OrgPassword !== req.body.password) return res.status(401).json("Wrong Credentials !"); //check existing user
    if (!bcrypt.compareSync(req.body.password, user.hashedPassword))
      return res.status(401).json("Wrong Credentials !"); //check existing user

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN_SEC,
      {
        expiresIn: "3d",
      }
    );

    const { hashedPassword, salt, __v, isAdmin, _id, ...customUser } =
      user._doc; //remove (password ans isAdmin) from user
    customUser.userId = user._id;
    return res.status(200).json({
      ...customUser,
      token: accessToken,
    });
    // return res.status(200).json({
    //     ...user.sendUserModel(),
    //     token: accessToken,
    //   });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = {
  register,
  login,
};
