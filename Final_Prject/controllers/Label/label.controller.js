const Label = require("../../models/label.model.js");
const Workspace = require("../../models/workspace.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const createLabel = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const workspaceId = req.params.workspaceId || data.workspace;

  if (!workspaceId) {
    return next(new AppError("Workspace id is required", 400, HttpStatus.FAIL));
  }

  const workspace = await Workspace.exists({ _id: workspaceId });
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }

  const label = await Label.create({
    ...data,
    workspace: workspaceId,
  });

  res.status(201).json({ status: HttpStatus.SUCCESS, data: label });
});

const getAllLabels = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const query = {};

  if (workspaceId) {
    const workspace = await Workspace.exists({ _id: workspaceId });
    if (!workspace) {
      return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
    }
    query.workspace = workspaceId;
  }

  const labels = await Label.find(query).populate("workspace", "name owner");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: labels });
});

const getLabelById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const label = await Label.findById(id).populate("workspace", "name owner");

  if (!label) {
    return next(new AppError("Label not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: label });
});

const updateLabelById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingLabel = await Label.findById(id);
  if (!existingLabel) {
    return next(new AppError("Label not found", 404, HttpStatus.FAIL));
  }

  if (data.workspace) {
    const workspace = await Workspace.exists({ _id: data.workspace });
    if (!workspace) {
      return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
    }
  }

  const label = await Label.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  }).populate("workspace", "name owner");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: label });
});

const deleteLabelById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const label = await Label.findByIdAndDelete(id);
  if (!label) {
    return next(new AppError("Label not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Label deleted successfully",
  });
});

module.exports = {
  createLabel,
  getAllLabels,
  getLabelById,
  updateLabelById,
  deleteLabelById,
};
