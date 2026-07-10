const mongoose = require("mongoose");
const { Schema } = mongoose;

const attachmentSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, "Attachment file name is required"],
      trim: true,
    },

    originalName: {
      type: String,
      trim: true,
      default: "",
    },

    fileUrl: {
      type: String,
      required: [true, "Attachment file url is required"],
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Attachment uploader is required"],
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  },
);

attachmentSchema.index({ uploadedBy: 1 });
attachmentSchema.index({ workspace: 1 });
attachmentSchema.index({ project: 1 });
attachmentSchema.index({ task: 1 });
attachmentSchema.index({ comment: 1 });
attachmentSchema.index({ message: 1 });
attachmentSchema.index({ chat: 1 });

const Attachment = mongoose.model("Attachment", attachmentSchema);

module.exports = Attachment;
