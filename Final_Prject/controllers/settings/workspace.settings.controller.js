const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const Workspace = require("../../models/workspace.model.js");
const WorkspaceSettings = require("../../models/workspaceSettings.model.js");

const getWorkspaceSettings = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    const error = AppError.create("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    const error = AppError.create(
      "Only the workspace owner can access these settings",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  const settings = await WorkspaceSettings.findOne({ workspace: workspaceId });

  if (!settings) {
    const error = AppError.create(
      "Workspace settings not found",
      404,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Workspace settings fetched successfully",
    data: settings,
  });
});

const updateWorkspaceSettings = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { visibility, allowInvitations } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    const error = AppError.create("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    const error = AppError.create(
      "Only the workspace owner can update these settings",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  const settings = await WorkspaceSettings.findOneAndUpdate(
    { workspace: workspaceId },
    { visibility, allowInvitations },
    { returnDocument: "after", runValidators: true },
  );

  if (!settings) {
    const error = AppError.create(
      "Workspace settings not found",
      404,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Workspace settings updated successfully",
    data: settings,
  });
});

module.exports = {
  getWorkspaceSettings,
  updateWorkspaceSettings,
};
