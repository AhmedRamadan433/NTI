const fs = require("fs").promises;
const path = require("path");

const deleteUploadedFile = async (filename, foldername) => {
  const filePath = path.join(__dirname, "..", "uploads", foldername, filename);

  try {
    await fs.unlink(filePath);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

module.exports = deleteUploadedFile;
