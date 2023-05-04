import express from "express";
const router = express.Router();

import { isLoggedIn } from "../controllers/auth.middleware.js";
import * as LessonController from "../controllers/lesson.controller.js";

router.get("/lesson/:lId", isLoggedIn, await LessonController.renderLessonPage);

router.post(
  "/lesson/:courseId",
  isLoggedIn,
  await LessonController.addOrUpdateLesson
);
router.delete(
  "/lesson/:lsnId",
  isLoggedIn,
  await LessonController.deleteLesson
);

export default router;
