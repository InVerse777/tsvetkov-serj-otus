import express from "express";
const router = express.Router();
import * as ResourceController from "../controllers/resource.controller.js";
import { isLoggedIn } from "../controllers/auth.middleware.js";

router.post(
  "/resource/:lessonId",
  isLoggedIn,
  await ResourceController.addResource
);
router.patch(
  "/resource/:lessonId/:resId",
  await ResourceController.editResource
);
router.delete(
  "/resource/:lessonId/:resId",
  await ResourceController.deleteResource
);

export default router;
