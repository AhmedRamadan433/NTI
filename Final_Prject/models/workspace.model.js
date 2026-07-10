const mongoose = require("mongoose");
const { Schema } = mongoose;

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Workspace owner is required"],
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["owner", "admin", "member", "guest"],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    avatar: {
      type: String,
      trim: true,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ members: 1 });
workspaceSchema.index({ name: 1, owner: 1 }, { unique: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
