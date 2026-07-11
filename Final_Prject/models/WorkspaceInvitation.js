const mongoose = require("mongoose");
const { Schema } = mongoose;
const WorkspaceInvitationSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
  },
  {
    timestamps: true,
  },
);
const WorkspaceInvitation = mongoose.model(
  "WorkspaceInvitation",
  WorkspaceInvitationSchema,
);
module.exports = WorkspaceInvitation;
