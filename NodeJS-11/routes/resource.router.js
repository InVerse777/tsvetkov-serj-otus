import express from "express";
const router = express.Router();
import * as ResourceController from "../controllers/resource.controller.js";
import { isLoggedIn } from "../controllers/auth.middleware.js";

router.post(
  "/resource/:lessonId",
  isLoggedIn,
  await ResourceController.addResource
);
router.get(
  "/resource/:lessonId/:resourceId",
  isLoggedIn,
  await ResourceController.getResource
);
router.patch(
  "/resource/:lessonId/:resourceId",
  isLoggedIn,
  await ResourceController.editResource
);
router.delete(
  "/resource/:lessonId/:resId",
  isLoggedIn,
  await ResourceController.deleteResource
);

export default router;
