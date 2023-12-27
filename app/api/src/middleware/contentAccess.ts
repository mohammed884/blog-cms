/*
*NOTE-SHOULD BE ONLY USED BEFORE ANY ROUTE THAT RETRIEVE ALOT OF DATA
*NOTE-SHOULDN'T BE USED FOR GETTING USER DATA RELATED ROUTES
*/
import Article from "../domains/article/model";
import Comment from "../domains/article/comment/model";
import { Request, Response, NextFunction } from "express";
import { setCache } from "../helpers/node-cache";
import { getUserFromToken } from "../helpers/jwt";
import { ObjectId } from "bson"
import {
    checkCache,
    buildSearchQuery,
    isValidSearchQuery,
    checkBlockedList
} from "../helpers/block"
type ContentType =
    "get-comments" |
    "get-likes" |
    "add-comment" |
    "add-like" |
    "add-reply" |
    "add-comment-like" |
    "save-article";
interface IOpts {
    contentType: ContentType;
    queryField?: string;
    dataHolder: "params" | "body";
    contentIdField: string;
    commentBucketIdField?: string;
};
interface ICheckIfBlockedOpts {
    contentType: ContentType;
    userIdToCheck: string;
    contentId: string
}
const isBlocked = ({ contentType, dataHolder, contentIdField, queryField }: IOpts) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userToCheck = req.user || await getUserFromToken(req.cookies.access_token);
            if (!userToCheck) return next();
            const contentId = getProvidedId(req, dataHolder, contentIdField);
            if (!contentId) {
                return res.status(401).send({ success: false, message: "Please provide content id" });
            }
            const searchQuery = buildSearchQuery(queryField, contentIdField, contentId);
            if (!isValidSearchQuery(searchQuery)) {
                return res.status(401).send({ success: false, message: "User not found" });
            }
            const { contentNotFound, isBlocked, articlePublisherId, commentAuthorId } = await checkIfBlocked({ contentType, userIdToCheck: String(userToCheck._id), contentId });
            if (contentNotFound) {
                return res.status(401).send({ success: false, message: "Content not found" });
            }
            if (isBlocked) {
                return res.status(401).send({ success: false, isBlocked: true, message: "You are blocked from this content" });
            }
            if (articlePublisherId) {
                req.articlePublisherId = articlePublisherId;
            }
            if (commentAuthorId) {
                req.commentAuthorId = commentAuthorId;
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send({ success: false, message: "Internal server error" });
        }
    }
};
const checkIfBlocked = async ({
    userIdToCheck,
    contentType,
    contentId
}: ICheckIfBlockedOpts): Promise<{
    isBlocked?: boolean,
    contentNotFound?: boolean,
    articlePublisherId?: string,
    commentAuthorId?: string
}> => {
    let isBlocked: boolean;
    switch (contentType) {
        case "get-comments":
        case "get-likes":
        case "add-like":
        case "add-comment":
            const articleId = contentId;
            const article = await Article.findById(articleId).populate("publisher", "blocked username _id");
            if (!article) {
                return { contentNotFound: true };
            }
            const publisher: any = article.publisher;
            if (publisher.id === userIdToCheck) {
                return { isBlocked: false, articlePublisherId: contentType === "add-comment" ? publisher.id : "" };
            };
            const cacheResult = checkCache({ _id: publisher.id }, userIdToCheck, "_id");
            if (cacheResult.isBlocked) {
                return { isBlocked: true };
            }
            isBlocked = checkBlockedList(publisher.blocked, userIdToCheck);
            if (isBlocked) {
                setCache({
                    key: userIdToCheck,
                    value: [...cacheResult?.cachedBlockedFromList, { _id: publisher.id, username: publisher.username }],
                    ttl: "30-days",
                });
            };
            return { isBlocked, articlePublisherId: contentType === "add-comment" ? publisher.id : "" };
        case "add-reply":
        case "add-comment-like":
            const commentId = new ObjectId(contentId);
            const aggregation = [
                {
                    $match: {
                        "comments._id": commentId
                    }
                },
                {
                    $unwind: "$comments"
                },
                {
                    $match: {
                        "comments._id": commentId
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "comments.author",
                        foreignField: "_id",
                        as: "authorDetails",
                        pipeline: [
                            {
                                $project: {
                                    blocked: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$authorDetails"
                },
                {
                    $group: {
                        _id: "$_id",
                        data: { $push: "$authorDetails" },
                    }
                },
            ];
            const authorDetails: any = await Comment.aggregate(aggregation);
            if (!authorDetails[0]) {
                return { contentNotFound: true };
            }
            const author = authorDetails[0].data[0];
            const authorId = String(author._id);            
            if (authorId === userIdToCheck) {
                return { isBlocked: false, commentAuthorId: authorId };
            };
            const cacheResult2 = checkCache({ _id: authorId }, userIdToCheck, "_id");
            if (cacheResult2.isBlocked) return { isBlocked: true }
            isBlocked = checkBlockedList(author.blocked, userIdToCheck);
            if (isBlocked) {
                setCache({
                    key: userIdToCheck,
                    value: [...cacheResult2?.cachedBlockedFromList, { _id: authorId, username: author.username }],
                    ttl: "30-days",
                });
            };
            return { isBlocked, commentAuthorId: authorId };
        default:
            console.log("default");
            return { isBlocked: false }
    }
}

const getProvidedId = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};
export default isBlocked