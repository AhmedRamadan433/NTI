const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.jwt_secret);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = protect;
