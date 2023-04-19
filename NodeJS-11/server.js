const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const  rateLimit = require('express-rate-limit')

const loginlimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const UserRouter = require("./routes/user.router");
const LessonRouter = require("./routes/lesson.router");
const CoursesRouter = require("./routes/courses.router");
const CourseRouter = require("./routes/course.router");
const CommentRouter = require("./routes/comments.router");
const ResourceRouter = require("./routes/resource.router");
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/user/login', loginlimiter)

app.use(express.static(path.join(__dirname, "static")));
app.use(
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);
app.set("view engine", "pug");

app.use("/user", UserRouter);
app.use(CoursesRouter);
app.use(CourseRouter);
app.use(LessonRouter);
app.use(CommentRouter);
app.use(ResourceRouter);

const server = app.listen(process.env.PORT || 3333, () => {
  console.log(`Server started on port: ${server.address().port}`);
});
