import { Request, Response } from "express";
import { sendNotification, deleteNotification } from "../../notification/controller";
import Follow from "./model";
import { countData, pagination } from "../../../helpers/aggregation";
import { ObjectId } from "bson";
const followActions = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userToOpreateOn = req.params.userId;
        const action = req.query.action;
        if (String(user._id) === userToOpreateOn) {
            return res.status(401).send({ success: false, message: "لا يمكنك متابعة نفسك" })
        }
        switch (action) {
            case "follow":
                const createFollow = await Follow.create(
                    {
                        user: userToOpreateOn,
                        followedBy: user._id
                    }
                );
                const notificationStatus = await sendNotification({
                    receiver: userToOpreateOn,
                    sender: user._id,
                    type: "follow",
                    retrieveId: String(createFollow._id)
                });
                if (!notificationStatus) {
                    return res.status(401).send({ success: false, message: "لم يتم ارسال الاشعار" })
                }
                res.status(201).send({ success: true, message: "تمت المتابعة" })
                break;
            case "un-follow":
                const deleteStatus = await Follow.findOneAndDelete(
                    {
                        user: userToOpreateOn,
                        followedBy: user._id
                    }
                ).lean()
                if (!deleteStatus) {
                    return res.status(401).send({ success: false, message: "لم يتم الغاء المتابعة" })
                }
                const notificationDeletion = await deleteNotification({
                    receiver: userToOpreateOn,
                    retrieveId: deleteStatus._id
                });
                if (!notificationDeletion.success) {
                    return res.status(401).send({ success: false, message: notificationDeletion.err });
                }
                res.status(201).send({ success: true, message: "تم الغاء المتابعة" })
                break;
            default:
                res.status(401).send({ success: false, message: "خطأ في العملية" })
        }
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(401).send({ success: false, message: "لقد تابعت هذا المستخدم من قبل" })
        }
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowing = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const page = Number(req.query.page) || 1;
        const matchQuery = { followedBy: new ObjectId(userId) };
        const result = await pagination({
            page,
            matchQuery,
            limit: 5,
            populate: {
                from: "users",
                foreignField:"_id",
                localField: "user",
                select: {
                    username: 1,
                    avatar: 1,
                },
                as: "followingInfo",
            },
            Model: Follow,
        })
        res.status(201).send({ success: true, following: result.data })
    } catch (error) {
        console.log(error);
    }
}
const getFollowers = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const page = Number(req.query.page) || 1;
        const matchQuery = { user:new ObjectId(userId) };        
        const result = await pagination({
            page,
            matchQuery,
            limit: 5,
            populate: {
                from: "users",
                foreignField:"_id",
                localField: "followedBy",
                select: {
                    username: 1,
                    avatar: 1
                },
                as: "followedByInfo",
            },
            Model: Follow,
        })
        res.status(201).send({ success: true, followers: result.data })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })

    }
};
const getFollowersCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const matchQuery = { user: userId };
        const result = await countData({
            matchQuery,
            countDocuments: true,
            Model: Follow,
        })
        res.status(201).send({ success: true, count: result.documentsCount })
    } catch (error) {
        console.log(error);

    }
};
const getFollowingCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const matchQuery = { followedBy: userId };
        const result = await countData({
            matchQuery,
            countDocuments: true,
            Model: Follow,
        })
        res.status(201).send({ success: true, count: result.documentsCount })
    } catch (error) {
        console.log(error);
    }
};
export {
    getFollowers,
    getFollowersCount,
    getFollowing,
    getFollowingCount,
    followActions,
}