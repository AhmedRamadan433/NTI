const Project = require("../../models/project.model.js");
const Workspace = require("../../models/workspace.model.js");
// const User = require("../models/user_model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
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
  const projects = await Project.find({ workspace: workspaceId }).populate(
    "projectOwner",
    "username email",
  );
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
  const project = await Project.findById(id).populate(
    "projectOwner",
    "username email",
  );
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
  const project = await Project.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
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
