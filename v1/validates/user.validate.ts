import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const registerValidate = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = Joi.object({
    fullName: Joi.string().trim().required().messages({
      "string.empty": "Full name is required",
    }),
    email: Joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    password: Joi.string().min(4).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 4 characters long",
    }),
  });

  const { error, value } = userSchema.validate(req.body);
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
