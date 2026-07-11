const Task = require("../../models/task.model.js");
const Project = require("../../models/project.model.js");
const Sprint = require("../../models/sprint.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");

const getTaskActivityScope = async (task) => {
  const projectId = task.project._id || task.project;
  const sprintId = task.sprint?._id || task.sprint || null;
  const project = await Project.findById(projectId).select("workspace");

  return {
    workspace: project?.workspace,
    project: projectId,
    sprint: sprintId,
    task: task._id,
  };
};

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

//// create task
const createTask = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const projectId = req.params.projectId || data.project;

  if (!projectId) {
    return next(new AppError("Project id is required", 400, HttpStatus.FAIL));
  }

  const project = await Project.findById(projectId).select("workspace");
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

  await ActivityService.log({
    action: ActivityActions.TASK_CREATED,
    actor: req.user.id,
    workspace: project.workspace,
    project: task.project,
    sprint: task.sprint || null,
    task: task._id,
    entityType: "task",
    entityId: task._id,
  });

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
  const { status, priority, assignee, label, sprint, sort, page, limit } =
    req.query;

  if (!projectId) {
    return next(new AppError("Project id is required", 400, HttpStatus.FAIL));
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new AppError("Project not found", 404, HttpStatus.FAIL));
  }

  const filter = {
    project: projectId,
    isArchived: false,
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignedTo = assignee;
  if (label) filter.labels = label;
  if (sprint) filter.sprint = sprint;

  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;

  const totalTasks = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .sort(sort || "-createdAt")
    .skip((currentPage - 1) * pageLimit)
    .limit(pageLimit)
    .populate("createdBy", "username email")
    .populate("assignedTo", "username email")
    .populate("labels", "name color")
    .populate("sprint", "name")
    .populate("project", "projectName");

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: tasks.length,
    pagination: {
      currentPage,
      totalPages: Math.ceil(totalTasks / pageLimit),
      totalTasks,
      limit: pageLimit,
    },
    data: tasks,
  });
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

  const { before, after } = getChangedFields(existingTask, task, data);
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_UPDATED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    ...(Object.keys(before).length && { before, after }),
  });

  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

//// delete task by id
const deleteTaskById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }

  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_DELETED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
  });

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
