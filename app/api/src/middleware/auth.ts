import { Request, Response, NextFunction } from "express";
import { getUserFromToken, verifyToken } from "../helpers/jwt";
import { redisClient, getOrSetCache } from "../redis-cache";
import { USER_ID_KEY } from "../redis-cache/keys";
import { USER_CACHE_EXPIARY } from "../redis-cache/expiries";

const isLoggedIn = (isAuthRequired: boolean | "_", setStatusOnly: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token;
      const decodedToken = verifyToken(accessToken);
      if (!decodedToken.success && !setStatusOnly) return res
        .status(401)
        .send({ success: false, isLoggedIn: false, message: "لم يتم العثور على المستخدم" });
      if (!decodedToken.success && setStatusOnly) return next()
      const user = await getOrSetCache(
        redisClient,
        `${USER_ID_KEY}=${decodedToken.decoded._id}`,
        () => (getUserFromToken("_", decodedToken.decoded._id)),
        USER_CACHE_EXPIARY,
      );
      if (setStatusOnly) {
        req.user = user;
        return next();
      }
      if (!user && isAuthRequired) {
        return res
          .status(401)
          .send({ success: false, isLoggedIn: false, message: "لم يتم العثور على المستخدم" });
      }
      if (user && !isAuthRequired) {
        return res
          .status(401)
          .send({ success: false, isLoggedIn: true, message: "تم تسجيل الدخول مسبقا" });
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
      res.status(500).send({ success: false, isLoggedIn: false, message: "Internal server error" });
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
