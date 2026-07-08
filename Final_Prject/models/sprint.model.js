const mongoose = require("mongoose");
const { Schema } = mongoose;

const sprintSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
    },

    goal: {
      type: String,
      trim: true,
      default: "",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Sprint must belong to a project"],
    },

    startDate: {
      type: Date,
      required: [true, "Sprint start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "Sprint end date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
sprintSchema.index({ project: 1 });
sprintSchema.index({ status: 1 });

const Sprint = mongoose.model("Sprint", sprintSchema);

module.exports = Sprint;
