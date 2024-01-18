import { Request, Response } from "express";
import User from "../user/model";
import { signToken, verifyToken } from "../../helpers/jwt";
import { hash, compare } from "../../helpers/bcrypt";
import { loginSchema, registerSchema } from "../../validation/auth";
import { sendMail } from "../../helpers/nodemailer";
import { IRegisterBody, ILoginBody } from "../../interfaces/body";
import { formatDateToYMD } from "../../helpers/date";
const register = async (req: Request, res: Response) => {
  try {
    const body: IRegisterBody = req.body;
    await registerSchema.validateAsync(body);
    const hashedPassword = await hash(body.password);
    const newUser = await User.create({
      ...body,
      password: hashedPassword,
      createdAt: formatDateToYMD(new Date(), "_"),
    });
    const accessToken = signToken(newUser._id.toString());
    res.cookie("access_token", accessToken, { secure: true });
    return res.status(200).send({ success: true, message: "تم انشاء الحساب" });
  } catch (err) {
    switch (true) {
      case err.isJoi:
        const { message, context } = err.details[0];
        return res.status(401).send({ success: false, message, context });
      case err.code === 11000 && err.keyPattern.email === 1:
        return res
          .status(401)
          .send({ success: false, message: "هذا الايميل مستخدم من قبل" });
      case err.code === 11000 && err.keyPattern.username === 1:
        return res
          .status(401)
          .send({ success: false, message: "هذا الاسم مستخدم من قبل" });
      default:
        res
          .status(500)
          .send({ success: false, message: "Internal Server error" });
    }
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const body: ILoginBody = req.body;
    await loginSchema.validateAsync(body);
    const user = await User.findOne({ email: body.email }).select("password").lean();
    if (!user)
      return res.status(401).send({
        success: false,
        message: "الايميل و الباسوورد لا يتطباقان",
      });

    const comparePasswords = await compare(body.password, user.password);
    if (!comparePasswords)
      return res.status(401).send({
        success: false,
        message: "الايميل و الباسوورد لا يتطباقان",
      });
    const accessToken = signToken(String(user._id));
    res.cookie("access_token", accessToken, { secure: process.env.NODE_ENV === "production" ? true : false, maxAge: 6 * 30 * 24 * 60 * 60 * 1000 });
    res
      .status(201)
      .send({ success: true, message: "تم تسجيل الدخول بنجاح" });
  } catch (err) {
    console.log(err);
  }
};
const logout = async (req: Request, res: Response) => {
  try {
    res.
      cookie("access_token", "").
      status(200).
      send({ success: true, message: "تم تسجيل الخروج بنجاح" });
  } catch (err) {
    console.log(err);
  }
};
const sendVerifyEmail = (req: Request, res: Response) => {
  try {
    const user = req.user;
    const token = signToken(user.email, { expiresIn: "5m" });
    const html = `
       <div>
           <h1>تاكيد الايميل</h1>
           <a href=http://localhost:6060/auth/confirm/email/${token}>اضغط هنا</a>
       </div>
      `;
    sendMail(user.email, "Verifying email", html);
    res.send({ success: true, message: "الرجاء تفقد الايميل" });
  } catch (err) {
    console.log(err);
  }
};
const verifyAccount = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token)
      return res.status(401).send({
        success: false,
        message: "لم يتم توفير توكن لتاكيد الحساب",
      });
    const decodedToken = verifyToken(token);
    await User.updateOne({ email: decodedToken.decoded }, {
      $set: {
        confirmed: true
      }
    });
    res.status(201).send({ success: true, message: "تم تاكيد الحساب" })
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: true, message: "internal server error probarly" })
  }
};
const sendResetPasswordEmail = (req: Request, res: Response) => {
  try {
    const user = req.user;
    const token = signToken(user.email);
    const html = `
       <div>
           <h1>اعادة تعين الباسسورد</h1>
           <a href=http://localhost:6000/auth/verify/email/${token}>اضغط هنا</a>
       </div>
      `;
    sendMail(user.email, "اعادة تعين الباسسورد", html);
    res.send({ success: true, message: "الرجاء تفقد الايميل" });
  } catch (err) {
    console.log(err);
  }
};
export {
  register,
  login,
  logout,
  sendVerifyEmail,
  sendResetPasswordEmail,
  verifyAccount
};
