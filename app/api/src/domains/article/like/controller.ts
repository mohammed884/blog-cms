import { Request, Response } from "express";
import Like from "./model";
import pagination from "../../../helpers/pagination";
/*
spotted a bug
there is no check if the request that is coming from the frontend is for the adding a like and i'm creating a bucket without checking that 
there is a like in the previous buckets
also i can't check if the user already liked the article from the bucket because i also have a $lt in the query
----
here it's tricky to check if the user already liked the article
i need to check if the user already liked the article by making a check query and get the bucket
first get a bucket that dosen't contain a user but in the same time i want it less than 50
and if the bucket is 50 i want to add a new bucket
and if the user exist i want to throw an error 
then check if the bucket items is less than 50
----
check if the dosen't user exist in the buckets
if the returned value is null then he exists therfore i need to throw an error
then check if the bucket items is less than 50
if it's i will add a new like 
else i need to make a new bucket
*/
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
                await Like.create({
                    article: articleId,
                    user: user._id,
                })
                res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
                break;
            case "remove":
                const deleteLikeStatus = await Like.deleteOne({ article: articleId, user: user._id });
                if (deleteLikeStatus.deletedCount === 0) {
                    return res.status(401).send({ success: false, message: "لا يوجد اعجاب ليتم ازالة" });
                }
                res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
                break;
        }
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.status(401).send({ success: false, message: "لقد اعجبت بالمقال سابقا" });
        } else {
            res.status(500).send({ success: false, message: "Internal server error" });
        }
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
            limit: 1,
        });

        res.status(200).send({ success: true, likes: result.data });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
}
const getLikesCount = async (req: Request, res: Response) => {
    try {
        const articleId = req.params.articleId;
        const count = Like.countDocuments({ article: articleId })
        res.status(200).send({ success: true, count });
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