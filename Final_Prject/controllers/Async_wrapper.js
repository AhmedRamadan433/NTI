const deleteUploadedFile = require("../utils/delete_uploaded_file.js");
const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (req.file) {
        await deleteUploadedFile(req.file.filename, req.uploadFolder);
      }
      next(error);
    }
  };
};
module.exports = asyncWrapper;
