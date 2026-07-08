const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["direct", "team", "project"],
      required: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ workspace: 1 });
chatSchema.index({ participants: 1 });
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
