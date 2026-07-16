const Workspace = require("../../models/workspace.model.js");
const AppError = require("../../utils/AppError.js");

const isOwner = async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return next(new AppError("Workspace not found", 404));
  }

  const owner = await Workspace.exists({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!owner) {
    return next(new AppError("Forbidden", 403));
  }

  next();
};

module.exports = { isOwner };
