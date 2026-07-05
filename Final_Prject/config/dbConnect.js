const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_uri, { dbName: process.env.db_name });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = connectDB;
