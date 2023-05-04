import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";

const app = express();
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import handleError from "./controllers/errorHandling.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

import UserRouter from "./routes/user.router.js";
import LessonRouter from "./routes/lesson.router.js";
import CoursesRouter from "./routes/courses.router.js";
import CourseRouter from "./routes/course.router.js";
import CommentRouter from "./routes/comments.router.js";
import ResourceRouter from "./routes/resource.router.js";
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/user/login", loginlimiter);

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
app.use(handleError)

const server = app.listen(process.env.PORT || 3333, () => {
  console.log(`Server started on port: ${server.address().port}`);
});
