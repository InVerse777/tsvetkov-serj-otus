import express from "express";
import * as CoursesController from "../controllers/courses.controller.js";
import { isLoggedIn, getUser } from "../controllers/auth.middleware.js";
const router = express.Router();
router.get("/", getUser, await CoursesController.renderCoursesPage);

router.get("/courses", getUser, await CoursesController.renderCoursesPage);

export default router;
