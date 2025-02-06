import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(existEmail){
    res.json({
      code: 400,
      message: "Email đã tồn tại"
    });
    return;
  }

  const dataUser = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password)
  };

  const user = new User(dataUser);
  await user.save();

  res.json({
    code: 200,
    message: "Đăng ký tài khoản thành công!",
  });
}

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if(!existUser) {
    res.json({
      code: 400,
      message: "Email hoặc mật khẩu không đúng!"
    });
    return;
  }
  
  if(md5(password) != existUser.password) {
    res.json({
      code: 400,
      message: "Email hoặc mật khẩu không đúng!"
    });
    return;
  }

  const token: string = jwt.sign({id: existUser.id}, `${process.env.JWT_KEY}`, {
    expiresIn: "1d"
  });

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token
  });
}