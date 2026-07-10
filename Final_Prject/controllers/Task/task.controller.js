const Task = require("../../models/task.model.js");
const Project = require("../../models/project.model.js");
const Sprint = require("../../models/sprint.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

//// create task
const createTask = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const projectId = req.params.projectId || data.project;

  if (!projectId) {
    return next(new AppError("Project id is required", 400, HttpStatus.FAIL));
  }

  const project = await Project.exists({ _id: projectId });
  if (!project) {
    return next(new AppError("Project not found", 404, HttpStatus.FAIL));
  }

  if (data.sprint) {
    const sprint = await Sprint.findOne({
      _id: data.sprint,
      project: projectId,
    });
    if (!sprint) {
      return next(
        new AppError(
          "Sprint not found or does not belong to this project",
          404,
          HttpStatus.FAIL,
        ),
      );
    }
  }

  const task = await Task.create({
    ...data,
    project: projectId,
    createdBy: req.user?._id || req.user?.id,
  });

  if (!task) {
    return next(new AppError("Task creation failed", 400, HttpStatus.FAIL));
  }

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "firstName lastName username email")
    .populate("assignedTo", "firstName lastName username email")
    .populate("labels", "name color")
    .populate("sprint", "name status");

  res.status(201).json({ status: HttpStatus.SUCCESS, data: populatedTask });
});

//// get all tasks (optionally by project)
const getAllTasks = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const query = {};

  if (projectId) {
    const project = await Project.exists({ _id: projectId });
    if (!project) {
      return next(new AppError("Project not found", 404, HttpStatus.FAIL));
    }
    query.project = projectId;
  }

  const tasks = await Task.find(query)
    .populate("createdBy", "firstName lastName username email")
    .populate("assignedTo", "firstName lastName username email")
    .populate("labels", "name color")
    .populate("sprint", "name status")
    .populate("project", "projectName projectStatus");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: tasks });
});

//// get task by id
const getTaskById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("createdBy", "firstName lastName username email")
    .populate("assignedTo", "firstName lastName username email")
    .populate("labels", "name color")
    .populate("sprint", "name status")
    .populate("project", "projectName projectStatus")
    .populate("parentTask", "title status priority");

  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

//// update task by id
const updateTaskById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingTask = await Task.findById(id);
  if (!existingTask) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }

  const targetProjectId = data.project || existingTask.project;

  if (data.project) {
    const project = await Project.exists({ _id: data.project });
    if (!project) {
      return next(new AppError("Project not found", 404, HttpStatus.FAIL));
    }
  }

  if (data.sprint) {
    const sprint = await Sprint.findOne({
      _id: data.sprint,
      project: targetProjectId,
    });
    if (!sprint) {
      return next(
        new AppError(
          "Sprint not found or does not belong to task project",
          404,
          HttpStatus.FAIL,
        ),
      );
    }
  }

  const task = await Task.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  })
    .populate("createdBy", "firstName lastName username email")
    .populate("assignedTo", "firstName lastName username email")
    .populate("labels", "name color")
    .populate("sprint", "name status")
    .populate("project", "projectName projectStatus")
    .populate("parentTask", "title status priority");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

//// delete task by id
const deleteTaskById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Task deleted successfully",
  });
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
