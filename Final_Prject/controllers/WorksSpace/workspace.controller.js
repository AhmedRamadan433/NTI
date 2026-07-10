const Workspace = require("../../models/workspace.model");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

///1-create workspace
const createWorkspace = asyncWrapper(async (req, res) => {
  const data = req.body;
  const workspace = await Workspace.create({ ...data, owner: req.user._id });
  if (!workspace) {
    throw new AppError("Failed to create workspace", 500, HttpStatus.FAIL);
  }

  workspace.members.push({ user: workspace.owner, role: "owner" });
  await workspace.save();
  res.status(201).send({ status: HttpStatus.SUCCESS, data: workspace });
});
/////// get all workspaces
const getAllWorkspaces = asyncWrapper(async (req, res) => {
  const workspaces = await Workspace.find();
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspaces });
});
///////// get workspace by id
const getWorkspaceById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const workspace = await Workspace.findById(id);
  if (!workspace) {
    throw new AppError("Workspace not found", 404, HttpStatus.FAIL);
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace });
});
//// update workspace
const updateWorkspace = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const workspace = await Workspace.findById(id);
  if (!workspace) {
    throw new AppError("Workspace not found", 404, HttpStatus.FAIL);
  }

  Object.assign(workspace, data);
  await workspace.save();

  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace });
});
//// delete workspace
const deleteWorkspace = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const workspace = await Workspace.findById(id);
  if (!workspace) {
    throw new AppError("Workspace not found", 404, HttpStatus.FAIL);
  }
  await workspace.deleteOne();

  res
    .status(200)
    .send({
      status: HttpStatus.SUCCESS,
      data: null,
      message: "Workspace deleted successfully",
    });
});
module.exports = {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
