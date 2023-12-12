import User from "../domains/user/models/user";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt";
/*
    *NOTE
    THIS FUNCTION SHOULD BE ONLY USED BEFORE ANY ROUTE THAT CONTAINS A LOT OF RETRIEVED DATA BECAUSE POPULATE THEM WILL BE SLOW
    this function will check the user that is making a request to do something if he is blocked
    REQUIREMENTS
    
*/
interface IOptions {
    queryfield: "_id" | "username",
    dataHolder: "params" | "body"
    requestedUserInfoField: string,
}
/*
    requestedUserInfo will be the field name that contains the data in the params or the body
    that will be assigned to the queryField to get the requestedUser from the database
*/
const isBlocked = ({ queryfield, dataHolder, requestedUserInfoField }: IOptions) => {
    try {
        //make it dynamic
        return async (req: Request, res: Response, next: NextFunction) => {
            let userToCheck;
            //check if the user is not logged in
            if (!req.user) {
                const token = req.cookies.access_token;
                const validateToken = verifyToken(token);
                userToCheck = await User.findOne({ _id: validateToken.decoded });
            } else {
                //check if the user is already logged in
                userToCheck = req.user;
            }
            if (!userToCheck) {
                //maby add isLoggedIn false in the req object
                return next()
            };
            const searchQuery =
                dataHolder === "body"
                    ?
                    { [queryfield]: req.body[requestedUserInfoField] }
                    :
                    { [queryfield]: req.params[requestedUserInfoField] };
            //check if the requestUser is the same as the userToCheck
            if (!searchQuery._id && !searchQuery.username) return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم المطلوب" });
            if (searchQuery._id === userToCheck._id || searchQuery.username === userToCheck.username) {
                if (!req.user) req.user = userToCheck
                return next();
            }
            const requestedUser =
                searchQuery._id
                    ?
                    await User.findById(searchQuery._id).lean()
                    :
                    await User.findOne({ username: searchQuery.username }).lean();
            if (!requestedUser) return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم المطلوب" });
            const isBlocked = requestedUser.blocked.some(u => String(u.user) === String(userToCheck._id));
            if (isBlocked) {
                return res.status(401).send({ success: false, isBlocked: true, message: "غير مصرح لا يمكنك اتمام هذا الاجراء المطلوب" });
            }
            next();
        }
    } catch (err) {
        console.log(err);
    }
};
export {
    isBlocked
}