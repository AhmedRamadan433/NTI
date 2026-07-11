const Activity = require("../../models/activity.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const buildPagination = (req) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const parsedLimit = Number.parseInt(req.query.limit, 10) || 20;

  if (page < 1 || parsedLimit < 1) {
    throw new AppError(
      "Pagination values must be positive numbers",
      400,
      HttpStatus.FAIL,
    );
  }

  const limit = Math.min(parsedLimit, 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const fetchActivities = async (filter, req, res) => {
  const { page, limit, skip } = buildPagination(req);

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .populate("actor", "username email avatar userImage")
      .populate("targetUser", "username email avatar userImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  return res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getWorkspaceActivities = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  if (!workspaceId) {
    return next(new AppError("workspaceId is required", 400, HttpStatus.FAIL));
  }

  return fetchActivities({ workspace: workspaceId }, req, res);
});

const getProjectActivities = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    return next(new AppError("projectId is required", 400, HttpStatus.FAIL));
  }

  return fetchActivities({ project: projectId }, req, res);
});

const getSprintActivities = asyncWrapper(async (req, res, next) => {
  const { sprintId } = req.params;
  if (!sprintId) {
    return next(new AppError("sprintId is required", 400, HttpStatus.FAIL));
  }

  return fetchActivities({ sprint: sprintId }, req, res);
});

const getTaskActivities = asyncWrapper(async (req, res, next) => {
  const { taskId } = req.params;
  if (!taskId) {
    return next(new AppError("taskId is required", 400, HttpStatus.FAIL));
  }

  return fetchActivities({ task: taskId }, req, res);
});

const getUserActivities = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(new AppError("userId is required", 400, HttpStatus.FAIL));
  }

  return fetchActivities({ actor: userId }, req, res);
});

module.exports = {
  getWorkspaceActivities,
  getProjectActivities,
  getSprintActivities,
  getTaskActivities,
  getUserActivities,
};
