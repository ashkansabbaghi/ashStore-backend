const User = require("../db/models/User.models");
const Address = require("../db/models/Address.models");

const getAllAddress = async (req, res, next) => {
  try {
    const address = await Address.find();
    return res.status(200).json(address);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "error sending addresses",
      },
    });
  }
};

const getListUserAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("addresses");
    const address = user.addresses.map((address) => {
      console.log(address);
      return address.itemAddressModel();
    });
    return res.status(200).json(address);
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "address not found",
      },
    });
  }
};

const addAddress = async (req, res, next) => {
  const addressObj =  req.body
  addressObj.user = req.user.id
  console.log(addressObj);
  try {
    const createAddress = await CreateAddress(addressObj);
    const user = await AddUserToAddress(req.body.userId, createAddress.id);
    return res.status(201).json(createAddress.itemAddressModel());
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: {
        status: 500,
        message: "address not created",
      },
    });
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { addressId, ...item } = req.body; //remove id in body

    console.log(item);
    const updateAddress = await Address.findByIdAndUpdate(
      req.body.addressId,
      { $set: item },
      { new: true }
    );
    return res.status(200).json(updateAddress.itemAddressModel());
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "address not updated",
      },
    });
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findByIdAndDelete(req.body.addressId);
    return res.status(200).json({remove  : address.itemAddressModel()});
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "address not deleted",
      },
    });
  }
};

/* ************************* Not Exports *************************** */

const CreateAddress = async (addressObj) => {
  return Address.create(addressObj).then((docAddress) => {
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
