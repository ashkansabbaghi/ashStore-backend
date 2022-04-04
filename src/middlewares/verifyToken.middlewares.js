const jwt = require("jsonwebtoken");
const User = require("../db/models/User.models");

const verifyAllUser = (req, res, next) => {
  const authHeaderToken = req.headers.token;
  if (authHeaderToken) {
    const token = authHeaderToken.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SEC, (err, user) => {
      if (err) return next();
      req.user = user;
      next();
    });
  } else {
    return next();
  }
};

const verifyToken = (req, res, next) => {
  const authHeaderToken = req.headers.token;
  if (authHeaderToken) {
    const token = authHeaderToken.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SEC, async (err, user) => {
      if (err) return res.status(403).json("token is not valid !");
      req.user = user;
      const resValidStatus = await verifyStatusUser(user);
      if (resValidStatus)
        res.status(resValidStatus.status).json(resValidStatus.json);
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated !");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user.id,req.user.isAdmin);
    if (req.user.id || req.user.isAdmin ) {
      next();
    } else {
      return res.status(401).json("you are not allowed to the that !");
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const adminHeader = req.headers;
    console.log(req.user.isAdmin ,  req.user.role ,adminHeader.apikey );
    if (req.user.isAdmin &&  req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json("You are not an admin!");
    }
  });
};

const verifySeller = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("verifySeller",req.user.codeSeller, req.user.role);
    if (req.user.role === "seller" && req.user.codeSeller !== 0 || req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json("You are not a seller!");
    }
  });
};

//

const verifyStatusUser = async (u) => {
  const user = await User.findById(u.id);
  if (user) {
    switch (user.userStatus) {
      case "active":
        return;
      case "blocked":
        return {
          status: 403,
          json: "Sorry, you've been blocked by a few people!",
        };
      case "banned":
        return { status: 403, json: "Your activity is not possible!" };
    }
  } else {
    return { status: 403, json: "This user is not available!" };
  }
};

module.exports = {
  verifyToken: verifyTokenAndAuthorization,
  verifyAdmin,
  verifySeller,

  verifyAllUser, // app.js
};
