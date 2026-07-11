const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivityActions = require("../utils/activityActions.js");

const activitySchema = new Schema(
  {
    // Action performed
    action: {
      type: String,
      enum: Object.values(ActivityActions),
      required: true,
      index: true,
    },

    // User who performed the action
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Main entity affected
    entityType: {
      type: String,
      enum: [
        "workspace",
        "project",
        "team",
        "sprint",
        "task",
        "comment",
        "attachment",
      ],
      required: true,
      index: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Scope
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },

    sprint: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
      index: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      index: true,
    },

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
      index: true,
    },

    // Optional target user
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Data before update
    before: {
      type: Schema.Types.Mixed,
      default: null,
    },

    // Data after update
    after: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
activitySchema.index({ workspace: 1, createdAt: -1 });
activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ sprint: 1, createdAt: -1 });
activitySchema.index({ task: 1, createdAt: -1 });
activitySchema.index({ team: 1, createdAt: -1 });
activitySchema.index({ actor: 1, createdAt: -1 });
activitySchema.index({ entityType: 1, entityId: 1 });

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
