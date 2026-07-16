const Workspace = require("../../models/workspace.model");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");
const WorkspaceSettings = require("../../models/workspaceSettings.model.js");
const deleteUploadedFile = require("../../utils/delete_uploaded_file.js");

const getChangedFields = (document, data) => {
  const before = {};
  const after = {};

  Object.entries(data).forEach(([key, value]) => {
    if (JSON.stringify(document[key]) !== JSON.stringify(value)) {
      before[key] = document[key];
      after[key] = value;
    }
  });

  return { before, after };
};

///1-create workspace
const createWorkspace = asyncWrapper(async (req, res) => {
  const data = req.body;
  const workspace = await Workspace.create({ ...data, owner: req.user._id });
  if (!workspace) {
    throw new AppError("Failed to create workspace", 500, HttpStatus.FAIL);
  }
  await WorkspaceSettings.create({ workspace: workspace._id });
  workspace.members.push({ user: workspace.owner, role: "owner" });
  await workspace.save();
  await ActivityService.log({
    action: ActivityActions.WORKSPACE_CREATED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
  });
  res.status(201).send({ status: HttpStatus.SUCCESS, data: workspace });
});

/////// get all workspaces
const getAllWorkspaces = asyncWrapper(async (req, res) => {
  const workspaces = await Workspace.find()
    .populate("owner", "username email")
    .populate("members.user", "username email");
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

  const oldAvatar = workspace.avatar;

  // only touch avatar if a new file was uploaded
  if (req.file) {
    data.avatar = req.file.filename;
  }

  const { before, after } = getChangedFields(workspace, data);
  Object.assign(workspace, data);
  await workspace.save();

  // save succeeded, safe to delete the old avatar now
  if (req.file && oldAvatar) {
    await deleteUploadedFile(oldAvatar, "");
  }

  await ActivityService.log({
    action: ActivityActions.WORKSPACE_UPDATED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
    ...(Object.keys(before).length && { before, after }),
  });

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

  res.status(200).send({
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
