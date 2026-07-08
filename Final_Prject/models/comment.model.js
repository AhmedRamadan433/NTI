const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Comment must belong to a task"],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment author is required"],
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
commentSchema.index({ task: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
