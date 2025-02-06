import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../controllers/task.controller";
import { createTaskValidate } from "../validates/task.validate";

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", createTaskValidate, controller.create);

router.patch("/edit/:id", controller.edit);

router.patch("/delete/:id", controller.deleteTask);

router.patch("/delete-multi", controller.deleteMulti);

export const taskRoutes: Router = router;