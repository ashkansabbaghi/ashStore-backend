const User = require("../db/models/User.models");
const Address = require("../db/models/Address.models");
// const bcrypt = require("bcrypt");

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
    // .populate("addresses");
    return res.status(200).json(user.sendUserModel());
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

//UPDATE USER
const updateUser = async (req, res, next) => {
  const { id: userId } = req.params;
  //   const user = await User.findOne({ id: userId });

  try {
    const upUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json({ ...upUser.sendUserModel() });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getAddress = async (req, res, next) => {
  const userId = req.params.id;
  const address = await User.findById(userId);
  console.log(address.addresses);
  return res.status(200).json(address.addresses);
};

const addAddress = async (req, res, next) => {
  const { ...address } = req.body;
  console.log(address);
  try {
    const createAddress = await CreateAddress(req.params.id, address);
    return res.status(201).json({ ...createAddress });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const CreateAddress = async (userId, address) => {
  const docAddress = await new Address(address);
  return await User.findByIdAndUpdate(
    userId,
    { $push: { addresses: docAddress._id } },
    { new: true, useFindAndModify: false }
  );
};

module.exports = {
  getUser,
  updateUser,
  addAddress,
  getAddress,
};
