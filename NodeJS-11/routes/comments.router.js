import express from "express";
import * as CommentsController from "../controllers/comments.controller.js";
import { isLoggedIn } from "../controllers/auth.middleware.js";
const router = express.Router();

router.post(
  "/comment/:lessonId",
  isLoggedIn,
  await CommentsController.addComment
);

router.delete(
  "/comment/:lessonId/:commentId",
  isLoggedIn,
  await CommentsController.deleteComment
);
router.patch(
  "/comment/:lessonId/:commentId",
  isLoggedIn,
  await CommentsController.patchComment
);

export default router;
