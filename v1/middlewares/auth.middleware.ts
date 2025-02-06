import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.headers.authorization) {
    res.json({
      code: 400,
      message: "Vui lòng gửi kèm token",
    });
    return;
  }

  const token: string = req.headers.authorization.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, `${process.env.JWT_KEY}`);

    const user = await User.findOne({
      _id: decoded.id,
      deleted: false,
    }).select("fullName email");

    res.locals.user = user;
    next();
  } catch (error) {
    res.json({
      code: 400,
      message: "Token không hợp lệ",
    });
    return;
  }
};
