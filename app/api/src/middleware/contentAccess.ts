/*
*NOTE-SHOULD BE ONLY USED BEFORE ANY ROUTE THAT RETRIEVE ALOT OF DATA
*NOTE-SHOULDN'T BE USED FOR GETTING USER DATA RELATED ROUTES
*/
import Article from "../domains/article/models/article";
import Comment from "../domains/article/comment/model";
import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserFromToken } from "../helpers/jwt";
import { redisClient, getOrSetCache } from "../redis-cache";
import { USER_ID_KEY } from "../redis-cache/keys";
import { USER_CACHE_EXPIARY, } from "../redis-cache/expiries";
import { ObjectId } from "bson"
import {
    buildSearchQuery,
    isValidSearchQuery,
} from "../helpers/block"
import { IArticle, IUser } from "interfaces/global";
type ContentType =
    "get-article" |
    "get-comments" |
    "get-likes" |
    "add-comment" |
    "add-like" |
    "add-reply" |
    "add-comment-like" |
    "save-article";
interface IISBlockedProps {
    contentType: ContentType;
    queryField?: string;
    dataHolder: "params" | "body";
    contentIdField: string;
    commentBucketIdField?: string;
};
interface ICheckBlockingStatusProps {
    contentType: ContentType;
    requestSender: IUser;
    contentId: string
}
type CheckBlockingStatusReturnValues = Promise<{
    isBlocked?: boolean,
    contentNotFound?: boolean,
    articlePublisherId?: string,
    commentAuthorId?: string,
    article?: IArticle
}>
const isBlocked = ({ contentType, dataHolder, contentIdField, queryField }: IISBlockedProps) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.cookies.access_token;
            const decodedToken = verifyToken(accessToken);
            if (!decodedToken.success) return next();
            const requestSender = req.user || await getOrSetCache(
                redisClient,
                `${USER_ID_KEY}=${decodedToken.decoded._id}`,
                async () => (await getUserFromToken("_", decodedToken.decoded._id)),
                USER_CACHE_EXPIARY
            );
            const contentId = getProvidedId(req, dataHolder, contentIdField);
            if (!contentId) {
                return res.status(401).send({ success: false, message: "الرجاء توفير معرف المحتوى" });
            }
            const searchQuery = buildSearchQuery(queryField, contentIdField, contentId);
            if (!isValidSearchQuery(searchQuery)) {
                return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم" });
            }
            const { contentNotFound, isBlocked, articlePublisherId, commentAuthorId, article } = await checkBlockingStatus({ contentType, requestSender, contentId });
            if (contentNotFound) {
                return res.status(401).send({ success: false, message: "لم يتم العثور على المحتوى" });
            }
            if (isBlocked) {
                return res.status(403).send({ success: false, isBlocked: true, message: "انت محظور من هذا المحتوى" });
            }
            if (article) {
                req.article = article;
            }
            if (articlePublisherId) {
                req.articlePublisherId = articlePublisherId;
            }
            if (commentAuthorId) {
                req.commentAuthorId = commentAuthorId;
            };
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send({ success: false, message: "Internal server error" });
        }
    }
};
const checkBlockingStatus = async ({
    requestSender,
    contentType,
    contentId
}: ICheckBlockingStatusProps): CheckBlockingStatusReturnValues => {
    const requestSenderId = String(requestSender._id);
    switch (contentType) {
        case "get-article":
        case "get-comments":
        case "get-likes":
        case "add-like":
        case "add-comment":
            const articleId = contentId;
            const article = await Article.findById(articleId).populate("publisher", "blocked username _id");
            if (!article) {
                return { contentNotFound: true };
            }
            const publisher: IUser = article.publisher as any;
            const didReqeustSenderBlockPubisher: boolean = requestSender.blocked.some(block => String(block.user) === publisher.id);
            if (didReqeustSenderBlockPubisher) {
                return { isBlocked: true };
            }
            const publisherId = String(publisher.id);
            if (publisherId === requestSenderId) {
                return {
                    isBlocked: false,
                    article: contentType === "get-article" ? article : undefined,
                    articlePublisherId: contentType === "add-comment" ? publisherId : undefined
                };
            };
            const didPublisherBlockRequestSender: boolean = publisher.blocked.some((block) => (String(block.user) === requestSenderId));
            if (didPublisherBlockRequestSender) {
                return { isBlocked: true };
            };
            return {
                isBlocked: false,
                articlePublisherId: contentType === "add-comment" ? publisherId : undefined,
                article: contentType === "get-article" ? article : undefined
            };
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
            const authorDetails: { _id: ObjectId, blocked: Array<{ user: ObjectId, createdAt: Date }> } = await Comment.aggregate(aggregation) as any;
            if (!authorDetails) {
                return { contentNotFound: true };
            };
            const author = authorDetails;
            const authorId = String(author._id);
            if (authorId === requestSenderId) return {
                isBlocked: false,
                commentAuthorId: authorId
            };
            const didRequestSenderBlockCommentAuthor = requestSender.blocked.some(block => String(block.user) === authorId)
            if (didRequestSenderBlockCommentAuthor) return { isBlocked: true, commentAuthorId: authorId };
            const didCommentAuthorBlockRequestSender: boolean = author.blocked.some((block) => (String(block.user) === requestSenderId));
            return {
                isBlocked: didCommentAuthorBlockRequestSender,
                commentAuthorId: authorId
            };
        default:
            return { isBlocked: false }
    }
}

const getProvidedId = (req: Request, holder: string, field: string) => {
    return holder === "params" ? req.params[field] : req.body[field];
};
export default isBlocked