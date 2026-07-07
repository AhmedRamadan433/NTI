const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/get.jwt.js");
const asyncWrapper = require("../controllers/Async_wrapper.js");
const httpStatus = require("../utils/HttpStatusText.js");
const AppError = require("../utils/AppError.js");
///// sign up
const signUp = asyncWrapper(async (req, res, next) => {
  ///1- check if email already exists
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.username
  ) {
    const error = new AppError(
      "Please Provide all required fields: name, email, and password",
      400,
      httpStatus.ERROR,
    );
    return next(error);
  }
  const comparepassword = req.body.password === req.body.passwordConfirm;
  if (!comparepassword) {
    const error = new AppError("Passwords do not match", 400, httpStatus.ERROR);
    return next(error);
  }
  req.body.passwordConfirm = undefined;
  const newUser = await User.create({
    ...req.body,
    role: "Member",
    userImage: req.file?.filename,
  });
  const token = generateToken(newUser);
  res.status(201).json({ status: httpStatus.SUCCESS, token, user: newUser });
});
///// login
const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new AppError(
      "Please provide email and password",
      400,
      httpStatus.ERROR,
    );
    return next(error);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new AppError(
      "Incorrect email or password",
      401,
      httpStatus.ERROR,
    );
    return next(error);
  }
  const token = generateToken(user);
  res.status(200).json({ status: httpStatus.SUCCESS, token });
});
module.exports = { signUp, signIn };
