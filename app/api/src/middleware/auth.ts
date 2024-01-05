import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "../helpers/jwt";

const isLoggedIn = (isAuthRequired: boolean | "_", setStatusOnly: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      const user = await getUserFromToken(token);
      if (setStatusOnly) {
        req.user = user;
        return next();
      }

      if (!user && isAuthRequired) {
        return res
          .status(401)
          .send({ success: false, message: "لم يتم العثور على المستخدم" });
      }
      if (user && !isAuthRequired) {
        return res
          .status(401)
          .send({ success: false, message: "تم تسجيل الدخول مسبقا" });
      }
      if (user && isAuthRequired) {
        req.user = user;
        return next();
      }
      if (!user && !isAuthRequired) {
        return next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: "Internal server error" });
    }
  };
};
const isConfirmed = (expectedStatus: boolean) => {
  try {
    return (req: Request, res: Response, next: NextFunction) => {
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
const role = (expectedRole: "user" | "admin" | "moderator") => {
  try {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (user.role !== expectedRole)
        return res.status(401).send({ success: false, message: "غير مصرح" });
      next();
    };
  } catch (err) {
    console.log(err);
  }
};
export {
  isLoggedIn,
  isConfirmed,
  role,
};
