const mongoose = require("mongoose");

const projectSettingsSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowAttachments: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProjectSettings", projectSettingsSchema);
