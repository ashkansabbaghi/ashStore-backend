const User = require('../db/models/User.models');
const CryptoJS = require('crypto-js');

//UPDATE USER
const updateUser = async (req, res) => {
const {id: userId} = req.params
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
	}


	try {
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{
				$set: req.body,
			},
			{
				new: true,
			}
		);
		return res.status(200).json(updateUser);
	} catch (e) {
		return res.status(500).json(e);
	}
};

module.exports = {
  updateUser,
}
