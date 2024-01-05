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
/*
i also need to check if the user that blocked the user wants to access his data
so i will change the two users in the equation to be like this
requestSender -> (prev userToCheck)
requestReciver -> (prev requestedUser)
so i will do that by checking the requestSender blocked list and the requestedUser blocked list
*/
const isBlocked = ({
    queryField,
    dataHolder,
    requestedUserInfoField
}: IOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let requestSender = req.user || await getUserFromToken(req.cookies.access_token);
            if (!requestSender) return next();

            const requestReciverIdentifier = getRequestReciverInfo(req, dataHolder, requestedUserInfoField);
            const searchQuery = buildSearchQuery(queryField, requestedUserInfoField, requestReciverIdentifier);
            if (!isValidSearchQuery(searchQuery)) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            if (isSameUser(searchQuery, requestSender)) {
                return next();
            }
            const isBlocked = await checkIfBlocked(searchQuery, requestSender, queryField);
            if (isBlocked) {
                return res.status(401).json({ success: false, isBlocked: true, message: "You are blocked from this content" });
            };
            next();
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error ?" });
        }
    }
};

const checkIfBlocked = async (searchQuery: ISearchQuery, requestSender: any, queryField: string) => {
    let isBlocked = false;
    const requestReciverInfo = searchQuery[queryField];
    if (requestSender.blocked.some(u => String(u[queryField]) === requestReciverInfo)) {        
        return true;
    }
    const cacheChecking = checkCache(searchQuery, requestSender.id,queryField);
    isBlocked = cacheChecking.isBlocked
    if (isBlocked) return true;
    const requestReciver = await findRequestReciver(searchQuery);

    if (!requestReciver) return false;
    isBlocked = requestReciver.blocked.some(u => String(u.user) === String(requestSender._id))
    if (isBlocked) {
        setCache({
            key: String(requestSender._id),
            value: requestReciver.blocked,
            ttl: "30-days"
        });
    }
    return isBlocked;
};
const getRequestReciverInfo = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};
const findRequestReciver = async (searchQuery: ISearchQuery) => {
    return searchQuery._id ?
        await User.findById(searchQuery._id).lean() :
        await User.findOne({ username: searchQuery.username }).lean();
};
export default isBlocked