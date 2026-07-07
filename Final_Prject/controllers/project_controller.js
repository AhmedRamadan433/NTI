const Project = require("../models/project_model.js");
// const User = require("../models/user_model.js");
const asyncWrapper = require("./Async_wrapper.js");
const AppError = require("../utils/AppError.js");
const HttpStatus = require("../utils/HttpStatusText.js");
///1 Create a new project
const createProject = asyncWrapper(async (req, res) => {
  const data = req.body;
  const project = await Project.create(data);
  if (!project) {
    const error = new AppError(
      500,
      "Failed to create project",
      HttpStatus.FAIL,
    );
    return next(error);
  }
  res.status(201).send({ status: HttpStatus.SUCCESS, data: project });
});
///// get all projects
const getAllProjects = asyncWrapper(async (req, res) => {
  const projects = await Project.find().populate("projectOwner", "name email");
  if (!projects) {
    const error = new AppError(
      500,
      "Failed to retrieve projects",
      HttpStatus.FAIL,
    );
    return next(error);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: projects });
});

////// get project by id
const getProjectById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id).populate(
    "projectOwner",
    "name email",
  );
  if (!project) {
    const error = new AppError("Project not found", 404, HttpStatus.FAIL);
    return next(error);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: project });
});

///// Update project

const updateProject = asyncWrapper(async (req, res) => {
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
const deleteProject = asyncWrapper(async (req, res) => {
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
