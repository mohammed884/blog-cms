/*
    NOTE -> SHOULDN'T BE USED FOR THE CONTENT RELATED ROUTES
*/
import { Request, Response, NextFunction } from "express";
import User from "../domains/user/model";
import { IUser } from "interfaces/global";
import { verifyToken, getUserFromToken } from "../helpers/jwt";
import { redisClient, getOrSetCache } from "../redis-cache";
import { USER_ID_KEY, USER_USERNAME_KEY } from "../redis-cache/keys";
import { USER_CACHE_EXPIARY, } from "../redis-cache/expiries";
import {
    buildSearchQuery,
    isValidSearchQuery,
    isSameUser,
} from "../helpers/block"
interface IOptions {
    queryField?: "_id" | "username";
    dataHolder: "params" | "body";
    requestReciverInfoField: string;
    storeRequestReciver?: boolean
}
interface ISearchQuery {
    _id?: string;
    username?: string;
}
const isBlocked = ({
    queryField,
    dataHolder,
    requestReciverInfoField,
    storeRequestReciver,
}: IOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.cookies.access_token;
            const decodedToken = verifyToken(accessToken);
            if (!decodedToken.success) return next();
            const requestSender = req.user || await getOrSetCache(
                redisClient,
                `${USER_ID_KEY}=${decodedToken.decoded._id}`,
                async () => (await getUserFromToken("_", decodedToken.decoded._id)),
                USER_CACHE_EXPIARY,
            );
            if (!requestSender) return next();
            const requestReciverIdentifier = getRequestReciverInfo(req, dataHolder, requestReciverInfoField);
            const searchQuery = buildSearchQuery(queryField, requestReciverInfoField, requestReciverIdentifier);
            if (!isValidSearchQuery(searchQuery)) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            if (isSameUser(searchQuery, requestSender)) {
                return next();
            };
            const requestReciver = await findRequestReciver(searchQuery);
            if (!requestReciver) {
                return res.status(401).json({ success: false, isBlocked: false, message: "لم يتم العثور على المستخدم المطلوب" });
            }
            const isBlocked = await checkBlockingStatus(requestSender, requestReciver);
            if (isBlocked) {
                return res.status(401).json({ success: false, isBlocked: true, message: "You are blocked from this content" });
            };
            if (storeRequestReciver) req.requestReciver = requestReciver
            next();
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error ?" });
        }
    }
};

const checkBlockingStatus = async (requestSender: IUser, requestReciver: IUser) => {
    const requestSenderId = String(requestSender._id);
    const requestReciverId = String(requestReciver._id);
    const didRequestSenderBlockRequestReciver = requestSender.blocked.some(block => block.user === requestReciverId);
    if (didRequestSenderBlockRequestReciver) return true;
    const didRequestReciverBlockRequestSender = requestReciver.blocked.some(block => block.user === requestSenderId);
    if (didRequestReciverBlockRequestSender) return true;
    return false;
};
const getRequestReciverInfo = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};
const findRequestReciver = async (searchQuery: ISearchQuery) => {
    const queryRequestReciver = async () => {
        return searchQuery._id ?
            await User.findById(searchQuery._id).select("-password").lean() :
            await User.findOne({ username: searchQuery.username }).select("-password").lean();
    };
    return await getOrSetCache(
        redisClient,
        searchQuery._id ? `${USER_ID_KEY}=${searchQuery._id}` : `${USER_USERNAME_KEY}=${searchQuery.username}`,
        queryRequestReciver,
        USER_CACHE_EXPIARY,
    );
};
export default isBlocked