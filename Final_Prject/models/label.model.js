const mongoose = require("mongoose");
const { Schema } = mongoose;

const labelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Label name is required"],
      trim: true,
    },

    color: {
      type: String,
      required: [true, "Label color is required"],
      default: "#3B82F6",
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Label must belong to a workspace"],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
labelSchema.index({ workspace: 1 });
labelSchema.index({ name: 1, workspace: 1 }, { unique: true });

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
