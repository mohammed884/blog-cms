/*
*NOTE-SHOULD BE ONLY USED BEFORE ANY ROUTE THAT RETRIEVE ALOT OF DATA
*NOTE-SHOULDN'T BE USED FOR THE CONTENT RELATED ROUTES
*/
import User from "../domains/user/model";
import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "../helpers/jwt";
import { setCache } from "../helpers/node-cache";
import {
    checkCache,
    buildSearchQuery,
    isValidSearchQuery,
    isSameUser,
} from "../helpers/block"
interface IOptions {
    queryField?: "_id" | "username";
    dataHolder: "params" | "body";
    requestedUserInfoField: string;
}
interface ISearchQuery {
    _id?: string;
    username?: string;
}
const isBlocked = ({
    queryField,
    dataHolder,
    requestedUserInfoField
}: IOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userToCheck = req.user || await getUserFromToken(req.cookies.access_token);
            if (!userToCheck) return next();

            const requestedUserInfo = getRequestedUserInfo(req, dataHolder, requestedUserInfoField);
            const searchQuery = buildSearchQuery(queryField, requestedUserInfoField, requestedUserInfo);

            if (!isValidSearchQuery(searchQuery)) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            if (isSameUser(searchQuery, userToCheck)) {
                if (!req.user) req.user = userToCheck;
                return next();
            }

            const isUserBlocked = await checkIfBlocked(searchQuery, userToCheck, queryField);
            if (isUserBlocked) {
                return res.status(401).json({ success: false, isBlocked: true, message: "You are blocked from this content" });
            }
            next();
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

const checkIfBlocked = async (searchQuery: ISearchQuery, user: any, queryField: string) => {
    let isBlocked = false;
    const cacheChecking = checkCache(searchQuery, user._id, queryField);
    isBlocked = cacheChecking.isBlocked
    if (isBlocked) return true
    const requestedUser = await findRequestedUser(searchQuery);
    if (!requestedUser) return false;

    isBlocked = requestedUser.blocked.some(u => String(u.user) === String(user._id));
    if (isBlocked) {
        setCache({
            key: String(user._id),
            value: requestedUser.blocked,
            ttl: "30-days"
        });
    }
    return isBlocked;
};
const getRequestedUserInfo = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};
const findRequestedUser = async (searchQuery: ISearchQuery) => {
    return searchQuery._id ?
        await User.findById(searchQuery._id).lean() :
        await User.findOne({ username: searchQuery.username }).lean();
};
export default isBlocked