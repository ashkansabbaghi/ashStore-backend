const User = require("../db/models/User.models");
const Address = require("../db/models/Address.models");
// admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("addresses");
    const newUsers = users.map((user) => {
      return user.sendUserModel();
    });
    return res.status(200).json({ ...newUsers });
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "There is an error sending users",
      },
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("addresses");
    return res.status(200).json(user.sendUserModel());
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "user not found",
      },
    });
  }
};

const updateUser = async (req, res, next) => {
  const { id: userId } = req.params;
  const { isAdmin, ...itemUpdate } = req.body; //remove isAdmin
  console.log(itemUpdate);
  try {
    const upUser = await User.findByIdAndUpdate(
      userId,
      { $set: itemUpdate },
      { new: true }
    );
    return res.status(200).json({ ...upUser.sendUserModel() });
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "user not update",
      },
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({
      error: {
        status: 500,
        message: "product could not be deleted"
      },
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
