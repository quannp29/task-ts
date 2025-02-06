import { Request, Response } from "express";
import Task from "../models/task.model";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
  interface Find {
    deleted: false,
    status?: string,
    title?: RegExp,
  }

  const find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = `${req.query.status}`;
  }

  // Search
  if(req.query.keyword) {
    const regex = new RegExp(`${req.query.keyword}`, "i");
    find.title = regex;
  }
  // End Search

  // Sort
  const sort: any = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[`${req.query.sortKey}`] = `${req.query.sortValue}`;
  }
  // End Sort

  // Pagination
  const pagination = {
    limit: 4,
    page: 1,
  };

  if (req.query.page) pagination.page = parseInt(`${req.query.page}`);
  if (req.query.limit) pagination.limit = parseInt(`${req.query.limit}`);

  const skip = (pagination.page - 1) * pagination.limit;
  // Pagination

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(skip);

  res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });

  res.json(task);
};
