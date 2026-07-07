const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    let fileFirstname;
    if (req.baseUrl.includes("users")) {
      fileFirstname = "user";
    } else if (req.baseUrl.includes("projects")) {
      fileFirstname = "project";
    }
    const filename = `${fileFirstname}-${Date.now()}.${extension}`;
    cb(null, filename);
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
        false,
      );
    }
  },
});
const upload = multer({ storage });
module.exports = upload;
