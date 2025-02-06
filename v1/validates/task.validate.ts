import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const createTaskValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskSchema = Joi.object({
    title: Joi.string().trim().min(3).required().messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters long",
    }),
    status: Joi.string()
      .valid("initial", "doing", "finish", "pending", "notFinish")
      .required()
      .messages({
        "any.only":
          "Status must be either initial, doing, finish, pending or notFinish",
      }),
    content: Joi.string().trim().optional(),
    timeStart: Joi.date().required().messages({
      "date.base": "Invalid start time",
    }),
    timeFinish: Joi.date().greater(Joi.ref("timeStart")).required().messages({
      "date.greater": "Finish time must be later than start time",
    }),
    listUser: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "ListUser must be an array of user ids",
    }),
    taskParentId: Joi.string().trim().optional(),
  });

  const { error, value } = taskSchema.validate(req.body);
  if (error) {
    res.json({
      code: 400,
      errors: error.details.map((item) => item.message),
    });
    return;
  }

  req.body = value;

  next();
};
