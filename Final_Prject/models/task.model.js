const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Task description cannot exceed 500 characters"],
    },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
    },
    labels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Label",
      },
    ],

    isArchived: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["To_Do", "In_Progress", "Done"],
      default: "To_Do",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task must belong to a project"],
    },

    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],

    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "Done" && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== "Done") {
      this.completedAt = null;
    }
  }
  next();
});

taskSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.status === "Done") {
    update.completedAt = new Date();
  } else if (update.status && update.status !== "Done") {
    update.completedAt = null;
  }
});

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, isArchived: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ endDate: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
