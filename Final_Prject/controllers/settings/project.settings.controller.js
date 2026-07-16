const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const Project = require("../../models/project.model.js");
const Workspace = require("../../models/workspace.model.js");
const ProjectSettings = require("../../models/projectSettings.model.js");

const getProjectSettings = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    const error = AppError.create("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  const workspace = await Workspace.findById(project.workspace);

  if (!workspace) {
    const error = AppError.create("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  const isOwner = workspace.owner.toString() === req.user._id.toString();

  const member = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  );

  const isAdmin = member && member.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = AppError.create(
      "Only the workspace owner or admin can access these settings",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  const settings = await ProjectSettings.findOne({ project: projectId });

  if (!settings) {
    const error = AppError.create(
      "Project settings not found",
      404,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Project settings fetched successfully",
    data: settings,
  });
});

const updateProjectSettings = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const { allowComments, allowAttachments } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    const error = AppError.create("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  const workspace = await Workspace.findById(project.workspace);

  if (!workspace) {
    const error = AppError.create("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  const isOwner = workspace.owner.toString() === req.user._id.toString();

  const member = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  );

  const isAdmin = member && member.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = AppError.create(
      "Only the workspace owner or admin can update these settings",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  const settings = await ProjectSettings.findOneAndUpdate(
    { project: projectId },
    { allowComments, allowAttachments },
    { returnDocument: "after", runValidators: true },
  );

  if (!settings) {
    const error = AppError.create(
      "Project settings not found",
      404,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Project settings updated successfully",
    data: settings,
  });
});

module.exports = {
  getProjectSettings,
  updateProjectSettings,
};
