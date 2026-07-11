const Project = require("../../models/project.model.js");
const Workspace = require("../../models/workspace.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");

//// 1 Archive a project
const archiveProject = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  if (
    req.user._id.toString() !== project.projectOwner.toString() ||
    req.user.role !== "Admin"
  ) {
    const error = new AppError(
      "You are not authorized to archive this project",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }
  if (project.status === "archived") {
    const error = new AppError("Project is already archived");
    return next(error);
  }
  const wasArchived = project.isArchived;
  project.isArchived = true;
  await project.save();
  await ActivityService.log({
    action: ActivityActions.PROJECT_ARCHIVED,
    actor: req.user.id,
    workspace: project.workspace,
    project: project._id,
    entityType: "project",
    entityId: project._id,
    ...(wasArchived !== project.isArchived && {
      before: { isArchived: wasArchived },
      after: { isArchived: project.isArchived },
    }),
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: project });
});

//// Restore a project
const restoreProject = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  if (project.status !== "archived") {
    const error = new AppError("Project is not archived");
    return next(error);
  }
  if (
    req.user._id.toString() !== project.projectOwner.toString() ||
    req.user.role !== "Admin"
  ) {
    const error = new AppError(
      "You are not authorized to restore this project",
      403,
      HttpStatus.FAIL,
    );
    return next(error);
  }
  const wasArchived = project.isArchived;
  project.isArchived = false;
  await project.save();
  await ActivityService.log({
    action: ActivityActions.PROJECT_RESTORED,
    actor: req.user.id,
    workspace: project.workspace,
    project: project._id,
    entityType: "project",
    entityId: project._id,
    ...(wasArchived !== project.isArchived && {
      before: { isArchived: wasArchived },
      after: { isArchived: project.isArchived },
    }),
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: project });
});

module.exports = {
  archiveProject,
  restoreProject,
};
