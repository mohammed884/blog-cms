import User from "../domains/user/models/user";
import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "../helpers/jwt";
import NodeCache from "node-cache";
/*
    *NOTE
    THIS FUNCTION SHOULD BE ONLY USED BEFORE ANY ROUTE THAT CONTAINS A LOT OF RETRIEVED DATA BECAUSE POPULATE THEM WILL BE SLOW
    this function will check the user that is making a request to do something if he is blocked
    *NOTE 
    if the requestedUserInfoField is the same as the queryField then this function don't need the queryField
    
*/
interface IOptions {
    queryField?: "_id" | "username";
    dataHolder: "params" | "body";
    requestedUserInfoField: string;
}
/*
    requestedUserInfo will be the field name that contains the data in the params or the body
    that will be assigned to the queryField to get the requestedUser from the database
*/
/*
first check if the requestedUser is in the user blockedFrom list
second check if the requestedUser is in the user blocked list and cache the user

*/
const cache = new NodeCache({});
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
                return res.status(401).json({ success: false, isBlocked: true, message: "You are blocked from this article" });
            }
            next();
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

const getRequestedUserInfo = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};

const buildSearchQuery = (queryField: string, requestedUserInfoField: string, requestedUserInfo: string) => {
    const field = queryField || requestedUserInfoField;
    return { [field]: requestedUserInfo };
};

const isValidSearchQuery = (searchQuery: any) => {
    return searchQuery._id || searchQuery.username;
};

const isSameUser = (searchQuery: any, user: any) => {
    return searchQuery._id === user._id || searchQuery.username === user.username;
};

const checkIfBlocked = async (searchQuery: any, user: any, queryField: string) => {
    let isBlocked = false;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const cachedBlockedFromList: Array<{ _id: string, username: string }> = cache.get(String(user._id)) || [];
    isBlocked = cachedBlockedFromList.some(u => String(u[queryField]) === searchQuery[queryField]);

    if (isBlocked) return true;

    const requestedUser = await findRequestedUser(searchQuery);
    if (!requestedUser) return false;

    isBlocked = requestedUser.blocked.some(u => String(u.user) === String(user._id));
    if (isBlocked) {
        cache.set(String(user._id), [...cachedBlockedFromList, { _id: requestedUser._id, username: requestedUser.username }], thirtyDaysMs);
    }

    return isBlocked;
};

const findRequestedUser = async (searchQuery: any) => {
    return searchQuery._id ?
        await User.findById(searchQuery._id).lean() :
        await User.findOne({ username: searchQuery.username }).lean();
};
export {
    isBlocked
}