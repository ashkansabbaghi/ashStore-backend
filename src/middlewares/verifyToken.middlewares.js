const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.TOKEN_SEC, (err, user) => {
			if(err) return res.status(403).json('token is not valid !');
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json('you are not authenticated !');
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			return res.status(401).json('you are not allowed to the that !');
		}
	});
};

const verifyAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		const adminHeader = req.headers
		console.log(adminHeader.apikey);
		console.log(req.user.isAdmin);
		if(req.user.isAdmin && adminHeader.apikey === "ashstore"){
			next();
		}else{
			return res.status(401).json('You are not an admin!')
		}

	})
}

module.exports = {
	verifyToken: verifyTokenAndAuthorization,
	verifyAdmin
};
