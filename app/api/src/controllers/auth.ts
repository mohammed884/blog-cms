import { Request, Response } from "express";
import User from "../models/user";
import { signToken, verifyToken } from "../helpers/jwt";
import { hash, compare } from "../helpers/bcrypt";
import { loginSchema, registerSchema } from "../validation/auth";
import { sendMail } from "../helpers/nodemailer";
import { ISendEmailRequest } from "../interfaces/global";
import { IRegisterBody, ILoginBody } from "../interfaces/body";
const register = async (req: Request, res: Response) => {
  try {
    const body: IRegisterBody = req.body;
    await registerSchema.validateAsync(body);
    const hashedPassword = await hash(body.password);
    const newUser = await User.create({
      ...body,
      password: hashedPassword,
    });
    const accessToken = signToken(newUser._id.toString());
    res.cookie("access_token", accessToken, { secure: true });
    return res.status(200).send({ success: true, message: "تم انشاء الحساب" });
  } catch (err) {
    switch (true) {
      case err.isJoi:
        const { message, context } = err.details[0];
        return res.status(401).send({ succesfull: false, message, context });
      case err.code === 11000 && err.keyPattern.email === 1:
        return res
          .status(401)
          .send({ success: false, message: "هذا الايميل مستخدم من قبل" });
      case err.code === 11000 && err.keyPattern.username === 1:
        return res
          .status(401)
          .send({ success: false, message: "هذا الاسم مستخدم من قبل" });
      default:
        console.log(err);
    }
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const body: ILoginBody = req.body;
    await loginSchema.validateAsync(body);
    const user = await User.findOne({ email: body.email });
    if (!user)
      return res.status(401).send({
        succesfull: false,
        message: "الايميل و الباسوورد لا يتطباقان",
      });

    const comparePasswords = await compare(body.password, user.password);
    if (!comparePasswords)
      return res.status(401).send({
        succesfull: false,
        message: "الايميل و الباسوورد لا يتطباقان",
      });

    const accessToken = signToken(user._id.toString());
    res.cookie("access_token", accessToken);
    res
      .status(201)
      .send({ succesfull: true, message: "تم تسجيل الدخول بنجاح" });
  } catch (err) {
    console.log(err);
  }
};
const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("access_token", "");
    res
      .status(201)
      .send({ succesfull: true, message: "تم تسجيل الخروج بنجاح" });
  } catch (err) {
    console.log(err);
  }
};
const sendVerifyEmail = (req: ISendEmailRequest, res: Response) => {
  try {
    /*
        check if the user exists
        sign a token then send the email
        with the email include a link that contains a token
        when the user click the token i will take it and decoded it and 
        then verify the user that the email belongs to
        */
    const user = req.user;
    const token = signToken(user.email, {});
    const html = `
       <div>
           <h1>تاكيد الايميل</h1>
           <a href=http://localhost:6000/auth/verify/email/${token}>اضغط هنا</a>
       </div>
      `;
    sendMail(user.email, "Verifying email", html);
    res.send({ success: true, message: "الرجاء تفقد الايميل" });
  } catch (err) {
    console.log(err);
  }
};
const verifyAccount = (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token)
      return res.send({
        success: false,
        message: "لم يتم توفير توكن لتاكيد الحساب",
      });

    const decodedToken = verifyToken(token);
    console.log(decodedToken.decoded);
  } catch (err) {
    console.log(err);
  }
};
const sendResetPasswordEmail = (req: ISendEmailRequest, res: Response) => {
  try {
    const user = req.user;
    const token = signToken(user.email);
    const html = `
       <div>
           <h1>اعادة تعين الباسسورد</h1>
           <a href=http://localhost:6000/auth/verify/email/${token}>اضغط هنا</a>
       </div>
      `;
    sendMail(user.email, "Verifying email", html);
    res.send({ success: true, message: "الرجاء تفقد الايميل" });
  } catch (err) {
    console.log(err);
  }
};
export { register, login, logout, sendVerifyEmail, sendResetPasswordEmail, verifyAccount };
