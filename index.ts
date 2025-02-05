import express, { Express, Request, Response } from "express";
import env from "dotenv";
env.config();

import { connect } from "./config/database";
import Task from "./models/task.model";
connect();

const app: Express = express();
const port: (number | string) = `${process.env.PORT}`;

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false
  });

  res.json(tasks);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
