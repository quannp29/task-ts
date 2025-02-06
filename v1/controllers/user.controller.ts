import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { generateRandomNumber } from "../../helpers/generate.helper";
import ForgotPassword from "../models/forgot-password.model";
import { sendEmail } from "../../helpers/sendEmail.helper";

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

// [GET] /api/v1/users/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  res.json({
    code: 200,
    user: res.locals.user
  });
}

// [POST] /api/v1/users/password/forgot
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if(!existUser) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  const otp = generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3*60*1000
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  const subject = "Lấy lại mật khẩu.";
  const text = `Mã OTP xác thực tài khoản của bạn là: ${otp}. Mã OTP có hiệu lực trong vòng 3 phút. Vui lòng không cung cấp mã OTP này với bất kỳ ai.`;
  sendEmail(email, subject, text);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!"
  });
}

// [POST] /api/v1/users/password/otp
export const passwordOtp = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;
  const otp: string = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ"
    });
    return;
  }

  const user = await User.findOne({
    email: email
  });

  const token = jwt.sign({id: user?.id}, `${process.env.JWT_KEY}`, {
    expiresIn: "30m"
  });

  res.json({
    code: 200,
    token: token,
    message: "Xác thực thành công!"
  });
};

// [POST] /api/v1/users/password/reset
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string = req.body.token;
    const password: string = req.body.password;

    const decoded: any = jwt.verify(token, `${process.env.JWT_KEY}`);
    const userId = decoded.id;

    await User.updateOne({
      _id: userId
    }, {
      password: md5(password)
    });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!"
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Đổi mật khẩu không thành công"
    })
  }
}

// [GET] /api/v1/users/list
export const list = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({
    deleted: false
  }).select("fullName email avatar");

  res.json({
    code: 200,
    message: "Thành công!",
    users: users
  });
}