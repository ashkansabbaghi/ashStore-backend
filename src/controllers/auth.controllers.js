const User = require("../db/models/User.models");
// const jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");

//TODO: bcrypt (hash pass)
//TODO: : https://www.npmjs.com/package/passport

// REGISTER
const register = async (req, res) => {
  try {
    const notValid = await ValidInput(req.body);
    if (notValid) return res.status(notValid.status).json(notValid.msg);
    const createUser = await CreateUser(req.body);
    return res
      .status(201)
      .json({ user: createUser.user.sendUserModel(), token: createUser.token });
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

    if (!Bcrypt.compareSync(req.body.password, user.hashedPassword))
      return res.status(401).json("Wrong Credentials !"); //check password

    const accessToken = user.generateToken();
    return res.status(200).json({
      ...user.sendUserModel(),
      token: accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

/* *********** not exports ************* */

const ValidInput = async (body) => {
  const { username, email, password, phone } = body;
  if (!(email && username && phone && password))
    return { status: 400, msg: "All input is required" }; // check empty input

  if (await User.findOne({ username }))
    return { status: 409, msg: "This username exists !" };

  if (await User.findOne({ email }))
    return { status: 409, msg: "There is a user with this email !" };
};

const CreateUser = async (body) => {
  const { username, email, password, phone } = body;
  const salt = Bcrypt.genSaltSync(+process.env.SALT_ROUND);
  const hashedPassword = Bcrypt.hashSync(password, salt);
  const newUser = new User({
    username,
    phone,
    email: email.toLowerCase(),
    salt,
    hashedPassword,
  });
  const token = newUser.generateToken();
  const user = await newUser.save();
  return { token, user };
};


module.exports = {
  register,
  login,
};
