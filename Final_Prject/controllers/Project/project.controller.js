const Project = require("../../models/project.model.js");
const Workspace = require("../../models/workspace.model.js");
// const User = require("../models/user_model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");
const ProjectSettings = require("../../models/projectSettings.model.js");
const getChangedFields = (previous, updated, data) => {
  const before = {};
  const after = {};

  Object.keys(data).forEach((key) => {
    if (JSON.stringify(previous[key]) !== JSON.stringify(updated[key])) {
      before[key] = previous[key];
      after[key] = updated[key];
    }
  });

  return { before, after };
};
///1 Create a new project in workspace
const createProject = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const workspaceId = req.params.workspaceId;
  const workspace = await Workspace.exists({ _id: workspaceId });
  if (!workspace) {
    const error = new AppError("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  const project = await Project.create({
    ...data,
    workspace: workspaceId,
    projectOwner: req.user._id,
    createdBy: req.user._id,
  });
  if (!project) {
    const error = new AppError(
      "Failed to create project",
      500,
      HttpStatus.FAIL,
    );
    return next(error);
  }
  await ProjectSettings.create({ project: project._id });
  await ActivityService.log({
    action: ActivityActions.PROJECT_CREATED,
    actor: req.user.id,
    workspace: project.workspace,
    project: project._id,
    entityType: "project",
    entityId: project._id,
  });
  res.status(201).send({ status: HttpStatus.SUCCESS, data: project });
});
///// get all projects in workspace
const getAllProjects = asyncWrapper(async (req, res, next) => {
  const workspaceId = req.params.workspaceId;
  const workspace = await Workspace.exists({ _id: workspaceId });
  if (!workspace) {
    const error = new AppError("Workspace not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  const projects = await Project.find({ workspace: workspaceId })
    .populate("projectOwner", "username email")
    .populate("createdBy", "username email")
    .populate("workspace", "name");
  if (!projects) {
    const error = new AppError(
      "Failed to retrieve projects",
      500,
      HttpStatus.FAIL,
    );
    return next(error);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: projects });
});

////// get project by id
const getProjectById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate("projectOwner", "username email")
    .populate("createdBy", "username email")
    .populate("workspace", "name");
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: project });
});

///// Update project

const updateProject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const previousProject = await Project.findById(id);
  if (!previousProject) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  const project = await Project.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  const { before, after } = getChangedFields(previousProject, project, data);
  await ActivityService.log({
    action: ActivityActions.PROJECT_UPDATED,
    actor: req.user.id,
    workspace: project.workspace,
    project: project._id,
    entityType: "project",
    entityId: project._id,
    ...(Object.keys(before).length && { before, after }),
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: project });
});

//// Delete project
const deleteProject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: null });
});

/////
module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
