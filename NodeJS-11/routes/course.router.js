import express from "express";
import { isLoggedIn , getUser} from "../controllers/auth.middleware.js";
const router = express.Router();
import * as CourseController from "../controllers/course.controller.js";
router.get("/course/:id", isLoggedIn, await CourseController.renderCoursePage);
router.get("/coursej/:id",isLoggedIn, await CourseController.getCourse);
router.post("/course", isLoggedIn, await CourseController.addCourse);

router.patch(
  "/course/:courseId",
  isLoggedIn,
  await CourseController.patchCourse
);
router.delete(
  "/course/:courseId",
  isLoggedIn,
  await CourseController.deleteCourse
);

router.post(
  "/course/access/:courseId",
  isLoggedIn,
  await CourseController.grantAccess
);

router.delete(
  "/course/access/:courseId",
  isLoggedIn,
  await CourseController.revokeAccess
);

export default router;
