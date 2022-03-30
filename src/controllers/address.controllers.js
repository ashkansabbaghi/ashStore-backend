const User = require("../db/models/User.models");
const Address = require("../db/models/Address.models");

const getAllAddress = async (req, res, next) => {
  try {
    console.log("all addresses");
    const address = await Address.find();
    return res.status(200).json(address);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getListUserAddress = async (req, res, next) => {
  const userId = req.params.id;
  const address = await User.findById(userId);
  console.log(address.addresses);
  return res.status(200).json(address.addresses);
};

const addAddress = async (req, res, next) => {
  const userId = req.params.id;
  const { ...address } = req.body;
  try {
    const createAddress = await CreateAddress(address);
    const user = await AddUserToAddress(userId, createAddress.id);
    return res.status(201).json(user.sendUserModel());
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { id, ...item } = req.body; //remove id in body
    const addressId = req.params.id;
    console.log(item);
    const updateAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: item },
      { new: true }
    );
    return res.status(200).json(updateAddress);
  } catch (e) {
    return res.status(500).json("not update address");
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    return res.status(200).json({remove: address});
  } catch (e) {
    return res.status(500).json("not delete address");
  }
};

/* ************************* Not Exports *************************** */

const CreateAddress = async (address) => {
  return Address.create(address).then((docAddress) => {
    return docAddress;
  });
};

const AddUserToAddress = (userId, addressId) => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { addresses: addressId } },
    { new: true, useFindAndModify: false }
  ).populate("addresses");
};

module.exports = {
  addAddress,
  getListUserAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
};
