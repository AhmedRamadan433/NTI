const Attachment = require("../../models/attachment.model.js");
const User = require("../../models/user.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const createAttachment = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const uploadedBy = data.uploadedBy || req.user?._id || req.user?.id;

  if (!uploadedBy) {
    return next(new AppError("Uploaded by is required", 400, HttpStatus.FAIL));
  }

  const uploader = await User.exists({ _id: uploadedBy });
  if (!uploader) {
    return next(new AppError("Uploader not found", 404, HttpStatus.FAIL));
  }

  const fileName = req.file?.filename || data.fileName;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : data.fileUrl;

  if (!fileName || !fileUrl) {
    return next(
      new AppError(
        "Attachment file name and url are required",
        400,
        HttpStatus.FAIL,
      ),
    );
  }

  const attachment = await Attachment.create({
    ...data,
    fileName,
    fileUrl,
    originalName: req.file?.originalname || data.originalName || "",
    mimeType: req.file?.mimetype || data.mimeType || "",
    size: req.file?.size || data.size || 0,
    uploadedBy,
  });

  const populatedAttachment = await Attachment.findById(
    attachment._id,
  ).populate("uploadedBy", "firstName lastName username email");

  res
    .status(201)
    .json({ status: HttpStatus.SUCCESS, data: populatedAttachment });
});

const getAllAttachments = asyncWrapper(async (req, res) => {
  const attachments = await Attachment.find()
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "firstName lastName username email")
    .populate("workspace", "name owner")
    .populate("project", "projectName projectStatus")
    .populate("task", "title status priority")
    .populate("comment", "content")
    .populate("message", "content createdAt")
    .populate("chat", "name type");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: attachments });
});

const getAttachmentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const attachment = await Attachment.findById(id)
    .populate("uploadedBy", "firstName lastName username email")
    .populate("workspace", "name owner")
    .populate("project", "projectName projectStatus")
    .populate("task", "title status priority")
    .populate("comment", "content")
    .populate("message", "content createdAt")
    .populate("chat", "name type");

  if (!attachment) {
    return next(new AppError("Attachment not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: attachment });
});

const updateAttachmentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingAttachment = await Attachment.findById(id);
  if (!existingAttachment) {
    return next(new AppError("Attachment not found", 404, HttpStatus.FAIL));
  }

  if (data.uploadedBy) {
    const uploader = await User.exists({ _id: data.uploadedBy });
    if (!uploader) {
      return next(new AppError("Uploader not found", 404, HttpStatus.FAIL));
    }
  }

  const updatePayload = { ...data };
  if (req.file) {
    updatePayload.fileName = req.file.filename;
    updatePayload.fileUrl = `/uploads/${req.file.filename}`;
    updatePayload.originalName = req.file.originalname;
    updatePayload.mimeType = req.file.mimetype;
    updatePayload.size = req.file.size;
  }

  const attachment = await Attachment.findByIdAndUpdate(id, updatePayload, {
    runValidators: true,
    returnDocument: "after",
  }).populate("uploadedBy", "firstName lastName username email");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: attachment });
});

const deleteAttachmentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const attachment = await Attachment.findByIdAndDelete(id);
  if (!attachment) {
    return next(new AppError("Attachment not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Attachment deleted successfully",
  });
});

module.exports = {
  createAttachment,
  getAllAttachments,
  getAttachmentById,
  updateAttachmentById,
  deleteAttachmentById,
};
