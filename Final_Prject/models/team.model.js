const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Team must belong to a workspace"],
    },

    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"],
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    avatar: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
teamSchema.index({ workspace: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ name: 1, workspace: 1 }, { unique: true });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
