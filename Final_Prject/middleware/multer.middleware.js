const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    let fileFirstname;
    if (req.originalUrl.includes("users")) {
      fileFirstname = "user";
    } else if (req.originalUrl.includes("project")) {
      fileFirstname = "project";
    } else if (req.originalUrl.includes("workspace")) {
      fileFirstname = "workspace";
    } else if (req.originalUrl.includes("attachment")) {
      fileFirstname = "attachment";
    } else {
      fileFirstname = "file";
    }
    const filename = `${fileFirstname}-${Date.now()}.${extension}`;
    cb(null, filename);
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, PDF, and TXT are allowed.",
        ),
        false,
      );
    }
  },
});

const upload = multer({ storage });
module.exports = upload;
