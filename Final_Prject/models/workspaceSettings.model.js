const mongoose = require("mongoose");

const workspaceSettingsSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    allowInvitations: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkspaceSettings", workspaceSettingsSchema);
