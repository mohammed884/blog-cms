import { Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt";
import User from "../models/user";
import { IRequestWithUser } from "interfaces/global";
export const isLoggedIn = (expectedStatus: boolean) => {
  try {
    return async (req: IRequestWithUser, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;
      const validateToken = verifyToken(token);
      const user = await User.findOne({ _id: validateToken.decoded });
      switch (true) {
        case !user && expectedStatus:
          return res
            .status(401)
            .send({ success: false, message: "لم يتم العثور على المستخدم" });
        case user && !expectedStatus:
          return res
            .status(401)
            .send({ success: false, message: "تم تسجيل الدخول مسبقا" });
        case user && expectedStatus:
          req.user = user;
          return next();
        case !user && !expectedStatus:
          return next();
        default:
          next();
      }
    };
  } catch (err) {
    console.log(err);
  }
};
export const isConfirmed = (expectedStatus: boolean) => {
  try {
    return (req: IRequestWithUser, res: Response, next: NextFunction) => {
      const user = req.user;
      switch (true) {
        case user.confirmed && expectedStatus:
          return next();
        case !user.confirmed && !expectedStatus:
          return next();
        case !user.confirmed && expectedStatus:
          return res
            .status(401)
            .send({ success: false, message: "يجب تاكيد الحساب اولا" });
        case user.confirmed && !expectedStatus:
          return res
            .status(401)
            .send({ success: false, message: "تم تاكيد الحساب مسبقا" });
        default:
          return next();
      }
    };
  } catch (err) {
    console.log(err);
  }
};
const role = async (expectedRole: "user" | "admin" | "mod") => {
  try {
    return (req: IRequestWithUser, res: Response) => {
      const user = req.user;
      if (user.role !== expectedRole) return 
    };
  } catch (err) {
    console.log(err);
  }
};
export default {
  isLoggedIn,
  isConfirmed,
};
