const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect.js");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const HttpStatusText = require("./utils/HttpStatusText.js");
const allRoutes = require("./routes/all_routes");
dotenv.config();
connectDB();
app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(express.json());
app.use("/", allRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    status: HttpStatusText.FAIL,
    message: "Page Not Found",
  });
});
app.use((err, req, res, next) => {
  let errors = [];

  if (err.name === "ValidationError") {
    console.log("Validation Error");
    return res.status(400).json({
      status: "FAIL",
      errName: err.name,
      message: Object.values(err.errors)
        .map((el) => el.message)
        .join(", "),
    });
  }
  res.status(err.statusCode || 500).json({
    status: err.statustext || HttpStatusText.ERROR,
    message: err.message || "Something Went Wrong",
    errors: err.errors || [],
  });
});
app.listen(process.env.Port, () => {
  console.log(`Server is running on port ${process.env.Port}`);
});
