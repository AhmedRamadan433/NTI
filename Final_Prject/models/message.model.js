const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Message sender is required"],
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
messageSchema.index({ receiver: 1 });
messageSchema.index({ project: 1 });
messageSchema.index({ team: 1 });
messageSchema.index({ workspace: 1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
