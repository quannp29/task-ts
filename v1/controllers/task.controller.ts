import { Request, Response } from "express";
import Task from "../models/task.model";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
  interface Find {
    deleted: false;
    status?: string;
    title?: RegExp;
  }

  const find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = `${req.query.status}`;
  }

  // Search
  if (req.query.keyword) {
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

  const userId: string = res.locals.user.id;

  const tasks = await Task.find({
    ...find,
    $or: [{ createdBy: res.locals.user.id }, { listUser: userId }],
  })
    .sort(sort)
    .limit(pagination.limit)
    .skip(skip);

  res.json({
    code: 200,
    message: "Thành công",
    tasks: tasks,
  });
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });

    res.json({
      code: 200,
      message: "Thành công",
      task: task,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại bản ghi!",
    });
  }
};

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại bản ghi!",
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids, status } = req.body;

  const listStatus: string[] = [
    "initial",
    "doing",
    "finish",
    "pending",
    "notFinish",
  ];

  if (!listStatus.includes(status)) {
    res.json({
      code: 400,
      message: `Trạng thái ${status} không hợp lệ!`,
    });
    return;
  }

  try {
    await Task.updateMany(
      {
        _id: { $in: ids },
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Đổi trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Đổi trạng thái không thành công!`,
    });
  }
};

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response): Promise<void> => {
  req.body.createdBy = res.locals.user.id;

  if(req.body.taskParentId) {
    try {
      const task = await Task.findOne({
        _id: req.body.taskParentId,
        deleted: false
      });

      if(!task) {
        res.json({
          code: 400,
          message: "Không tồn tại công việc phụ thuộc"
        });
        return;
      }
    } catch (error) {
      res.json({
        code: 400,
        message: "Không tồn tại công việc phụ thuộc"
      });
      return;
    }
  }

  const task = new Task(req.body);
  await task.save();

  res.json({
    code: 200,
    message: "Tạo công việc thành công!",
  });
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;
    const data = req.body;

    await Task.updateOne(
      {
        _id: id,
      },
      data
    );

    res.json({
      code: 200,
      message: "Cập nhật công việc thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật không thành công",
    });
  }
};

// [PATCH] /api/v1/tasks/delete/:id
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "Xóa công việc thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa công việc không thành công",
    });
  }
};

// [PATCH] /api/v1/tasks/delete-multi
export const deleteMulti = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;

    await Task.updateMany(
      {
        _id: { $in: ids },
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "Xóa các công việc thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa công việc không thành công",
    });
  }
};
