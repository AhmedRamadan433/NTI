const User = require("../../models/user.model.js");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../Async_wrapper.js");
const httpStatus = require("../../utils/HttpStatusText.js");
const AppError = require("../../utils/AppError.js");
const deleteUploadedFile = require("../../utils/delete_uploaded_file.js");

///// get my profile
const getMe = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new AppError("User not found", 404, httpStatus.ERROR);
    return next(error);
  }

  res.status(200).json({ status: httpStatus.SUCCESS, data: user });
});

///// update my profile
const updateMe = asyncWrapper(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    const error = new AppError(
      "This route is not for password updates. Use /updatepassword",
      400,
      httpStatus.ERROR,
    );
    return next(error);
  }

  const oldUser = await User.findById(req.user._id);

  if (!oldUser) {
    const error = new AppError("User not found", 404, httpStatus.ERROR);
    return next(error);
  }

  const { firstName, lastName, username, userBio, phoneNumber, userSkills } =
    req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      username,
      userBio,
      phoneNumber,
      userSkills,
      userImage: req.file?.filename,
    },
    { returnDocument: "after", runValidators: true },
  );

  // update succeeded, now safe to delete the old image (if a new one was uploaded)
  if (req.file && oldUser.userImage) {
    await deleteUploadedFile(oldUser.userImage, "");
  }

  res.status(200).json({ status: httpStatus.SUCCESS, data: user });
});

///// update my password
const updatePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    const error = new AppError(
      "Please provide currentPassword, newPassword and newPasswordConfirm",
      400,
      httpStatus.ERROR,
    );
    return next(error);
  }

  if (newPassword !== newPasswordConfirm) {
    const error = new AppError("Passwords do not match", 400, httpStatus.ERROR);
    return next(error);
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    const error = new AppError(
      "Current password is incorrect",
      401,
      httpStatus.ERROR,
    );
    return next(error);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Password updated successfully",
  });
});

module.exports = { getMe, updateMe, updatePassword };
