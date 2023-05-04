import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import * as UserController from "../controllers/user.controller.js";

router.get("/auth", await UserController.renderAuthPage);
router.post("/signup", await UserController.signup);

// Login route to verify a user and get a token
router.post("/login", await UserController.login);

export default router;
