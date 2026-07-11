const Workspace = require("../../models/workspace.model.js");
const AppError = require("../../utils/AppError.js");
const isOwner = async (req, res, next) => {
  const owner = await Workspace.exists({
    _id: req.params.workspaceId,
    owner: req.user._id,
  });
  if (!owner) {
    return next(new AppError("Forbidden", 403));
  }
  next();
};

module.exports = { isOwner };
