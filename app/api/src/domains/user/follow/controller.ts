import { Request, Response } from "express";
import { sendNotification, deleteNotification } from "../../notification/controller";
import Follow from "./model";
import pagination from "../../../helpers/pagination";
import { ObjectId } from "bson";
import { getDateYMD, formatDateToYMD } from "../../../helpers/date";
import User from "../model";
const followActions = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userIdToOpreateOn = req.params.userId;
        const action = req.query.action;
        if (!action || !userIdToOpreateOn) {
            return res.status(401).send({ success: false, message: "يرجى التاكد من المعطيات" })
        }
        if (String(user._id) === userIdToOpreateOn) {
            return res.status(401).send({ success: false, message: "لا يمكنك متابعة نفسك" })
        }
        const userToOpreateOn = await User.findById(userIdToOpreateOn);
        if (!userToOpreateOn) {
            return res.status(401).send({ success: false, message: "المستخدم غير موجود" })
        }
        switch (action) {
            case "follow":
                const createFollow = await Follow.create(
                    {
                        user: userToOpreateOn,
                        followedBy: user._id,
                        createdAt: formatDateToYMD(new Date(), "_"),
                    }
                );
                const notificationStatus = await sendNotification({
                    receiver: userIdToOpreateOn,
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
                    receiver: userIdToOpreateOn,
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
                foreignField: "_id",
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
        res.status(500).send({ success: false, message: "Internal server error" })

    }
};
const getFollowers = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const page = Number(req.query.page) || 1;
        const matchQuery = { user: new ObjectId(userId) };
        const result = await pagination({
            page,
            matchQuery,
            limit: 5,
            populate: {
                from: "users",
                foreignField: "_id",
                localField: "followedBy",
                select: {
                    username: 1,
                    avatar: 1
                },
                as: "followedBy",
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
        const count = await Follow.countDocuments({ user: userId })
        res.status(201).send({ success: true, count });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowingCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const count = await Follow.countDocuments({ followedBy: userId })
        res.status(201).send({ success: true, count })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const followersAnalysis = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const date = new Date();
        const { year, month, day } = getDateYMD(date);
        const dateList = formatDateToYMD(date, [1, 15, day], "DATE");
        const pipeline = [
            {
                $match: {
                    user: user._id,
                    createdAt: {
                        $gte: dateList[0],
                        $lte: dateList[1]
                    }
                }
            },
            {
                $facet: {
                    start: [
                        {
                            $match: {
                                createdAt: dateList[0],
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    mid: [
                        {
                            $match: {
                                createdAt: {
                                    $gt: dateList[0],
                                    $lte: dateList[1]
                                }
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    last: [
                        {
                            $match: {
                                createdAt: {
                                    $gt: dateList[1],
                                    $lte: dateList[2]
                                }
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                }
            }
        ]
        const data = await Follow.aggregate(pipeline)
        res.status(201).send({ success: true, data })
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
export {
    getFollowers,
    getFollowersCount,
    getFollowing,
    getFollowingCount,
    followActions,
    followersAnalysis,
};
