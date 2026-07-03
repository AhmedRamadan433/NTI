const express = require("express");
const courseRouter = require("./routes/course-routes");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/v1/courses", courseRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
