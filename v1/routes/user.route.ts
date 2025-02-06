import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", requireAuth, controller.detail);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.passwordOtp);

router.post("/password/reset", controller.resetPassword);

router.get("/list", requireAuth, controller.list);

export const userRoutes: Router = router;