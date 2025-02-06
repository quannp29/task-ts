import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { registerValidate } from "../validates/user.validate";

router.post("/register", registerValidate, controller.register);

router.post("/login", controller.login);

router.get("/detail", requireAuth, controller.detail);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.passwordOtp);

router.post("/password/reset", controller.resetPassword);

router.get("/list", requireAuth, controller.list);

export const userRoutes: Router = router;