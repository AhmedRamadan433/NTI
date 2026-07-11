const Activity = require("../models/activity.model.js");
const AppError = require("../utils/AppError.js");
const HttpStatus = require("../utils/HttpStatusText.js");

const REQUIRED_FIELDS = [
  "action",
  "actor",
  "workspace",
  "entityType",
  "entityId",
];

const log = async (data) => {
  if (!data || typeof data !== "object") {
    throw new AppError("Activity data is required", 400, HttpStatus.FAIL);
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missingFields.length) {
    throw new AppError(
      `Missing required activity fields: ${missingFields.join(", ")}`,
      400,
      HttpStatus.FAIL,
    );
  }

  const activity = await Activity.create(data);
  if (!activity) {
    throw new AppError("Failed to log activity", 500, HttpStatus.FAIL);
  }

  return activity;
};

module.exports = {
  log,
};
