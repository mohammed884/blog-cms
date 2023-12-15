import { Request, Response } from "express";
import Like from "./model";
import { pagination, countData } from "../../../helpers/aggregation";
const likeArticle = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const articleId = req.params.id;
        const action = req.query.action;
        if (!action || !articleId) {
            return res.status(401).send({ success: false, message: "الرجاء مراعاة المعطيات" })
        }
        switch (action) {
            case "add":
                const likesBucket = await Like.findOne({ article: articleId, likesCount: { $lt: 50 } });
                console.log(likesBucket);

                const isLikedBefore = likesBucket.likes.some((like) => String(like.user) === String(user._id));
                /*
                here it's tricky to check if the user already liked the article
                i need to check if the user already liked the article by making a check query and get the bucket
                first get a bucket that dosen't contain a user but in the same time i want it less than 50
                and if the bucket is 50 i want to add a new bucket
                and if the user exist i want to throw an error 
                then check if the bucket items is less than 50
        
                */
                if (!likesBucket) {
                    await Like.create({
                        article: articleId,
                        likes: [
                            {
                                user: user._id,
                                createdAt: new Date()
                            }
                        ],
                        likesCount: 1,
                    });
                }
                if (isLikedBefore) {
                    return res.status(201).send({ success: false, message: "انت معجب بالمقالة سابقا" });
                }
                likesBucket.likes = [...likesBucket.likes, { user: user._id, createdAt: new Date() }];
                likesBucket.likesCount++;
                await likesBucket.save();
                return res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
            case "remove":
                const updateBucketStatus = await Like.updateOne(
                    { article: articleId, "likes.user": user._id },
                    {
                        $pull: {
                            likes: {
                                user: user._id
                            }
                        },
                        $inc: {
                            likesCount: -1
                        }
                    }
                );
                if (updateBucketStatus.modifiedCount === 0) {
                    return res.status(401).send({ success: false, message: "لا يمكنك ازالة الاعجاب" });
                }
                res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
                break;
        }
        /*
        spotted a bug
        there is no check if the request that is coming from the frontend is for the adding a like and i'm creating a bucket without checking that 
        there is a like in the previous buckets
        also i can't check if the user already liked the article from the bucket because i also have a $lt in the query
        */
    } catch (err) {
        console.log(err);
    }
};
const getLikes = async (req: Request, res: Response) => {
    try {

        const articleId = req.params.articleId;
        const page = Number(req.query.page) || 1;
        const matchQuery = { article: articleId };
        const result = await pagination({
            matchQuery,
            Model: Like,
            page: page,
            limt: 1,
        });

        res.status(200).send({ success: true, likes: result.data });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
}
const getLikesCount = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const articleId = req.params.articleId;
        const matchQuery = { article: articleId };
        const likesCount = await countData({
            matchQuery,
            Model: Like,
            countArrayElements: "likes"
        });

        res.status(200).send({ success: true, count: likesCount.arrayElementsCount });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};
export {
    likeArticle,
    getLikes,
    getLikesCount
}