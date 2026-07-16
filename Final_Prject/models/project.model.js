const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [3, "Project name must be at least 3 characters long"],
      maxlength: [50, "Project name must be at most 50 characters long"],
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      minlength: [
        10,
        "Project description must be at least 10 characters long",
      ],
      maxlength: [500, "Project description is too long"],
    },
    projectEndDate: {
      type: Date,
    },
    projectStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    projectTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    teamMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Owner", "Admin", "Member"],
          default: "Member",
        },
      },
    ],
    projectOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace is required"],
    },
    projectComments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    projectPriority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    projectAttachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
projectSchema.index({ projectName: 1, projectOwner: 1 }, { unique: true });
projectSchema.index({ projectName: 1, teamMembers: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
