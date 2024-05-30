import { Request, Response } from "express";
import { sendNotification, deleteNotification } from "../../notification/controller";
import Follow from "./model";
import pagination from "../../../helpers/pagination";
import { ObjectId } from "bson";
import { getDateYMD, formatDateToYMD } from "../../../helpers/date";
import User from "../model";
import { getRequestReciversFollowingList, getRequestSenderAndReciverFollowingList, getRequestSenderFollowingList, isFollowingYou, transformFollowingStatus, youFollowing } from "../../../helpers/follow";
const followActions = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userIdToOpreateOn = req.params.userId;
        const action = req.query.action;
        if (!action || !userIdToOpreateOn) {
            return res.status(403).send({ success: false, message: "يرجى التاكد من المعطيات" })
        }
        if (String(user._id) === userIdToOpreateOn) {
            return res.status(403).send({ success: false, message: "لا يمكنك متابعة نفسك" })
        }
        const userToOpreateOn = await User.findById(userIdToOpreateOn);
        if (!userToOpreateOn) {
            return res.status(200).send({ success: false, message: "المستخدم غير موجود" })
        }
        switch (action) {
            case "follow":
                const hasFollowed = await Follow.findOne({ user: userIdToOpreateOn, followedBy: user._id }).lean();
                if (hasFollowed) return res.status(403).send({ success: false, message: "لقد قمت بمتابعة هذا المستخدم مسبقا" })
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
                ).lean();
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
                res.status(200).send({ success: true, message: "تم الغاء المتابعة" })
                break;
            default:
                res.status(401).send({ success: false, message: "خطأ في العملية" })
        }
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(403).send({ success: false, message: "لقد تابعت هذا المستخدم من قبل" })
        }
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowing = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userId = req.params.userId;
        const isSameUser = String(user?._id) === userId;
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
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    bio: 1,
                },
                as: "user",
            },
            Model: Follow,
        });
        const followingIds = result.data.map(follow => follow.user._id)
        const followingStatus: any = user && (
            isSameUser
                ?
                await getRequestReciversFollowingList(user._id, followingIds)
                :
                await getRequestSenderAndReciverFollowingList(user?._id, followingIds)
        )
        const following = followingStatus
            ?
            transformFollowingStatus({
                data: result.data,
                requestReciversFollowingList: isSameUser ? followingStatus : followingStatus.requestReciverFollowingList,
                requestSenderFollowingList: !user || isSameUser ? null : followingStatus.requestSenderFollowingList,
            })
            : result.data;
        res.status(200).send({ success: true, following: following || [] })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowers = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userId = req.params.userId;
        const isSameUser = String(user?._id) === userId
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
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    bio: 1,
                },
                as: "followedBy",
            },
            Model: Follow,
        });
        const followersIds = result.data.map(follow => follow.followedBy._id);
        const followersStatus: any =
            isSameUser
                ?
                await getRequestSenderFollowingList(user._id, followersIds)
                :
                await getRequestSenderAndReciverFollowingList(user._id, followersIds);
        const followers = followersStatus
            ?
            transformFollowingStatus({
                data: result.data,
                requestReciversFollowingList: isSameUser ? null : followersStatus.requestReciversFollowingList,
                requestSenderFollowingList: isSameUser ? followersStatus : followersStatus.requestSenderFollowingList,
            })
            :
            result.data;
        res.status(200).send({ success: true, followers: followers || [] })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowersCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const count = await Follow.countDocuments({ user: userId })
        res.status(200).send({ success: true, count });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const getFollowingCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const count = await Follow.countDocuments({ followedBy: userId })
        res.status(200).send({ success: true, count })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const followersAnalysis = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const date = new Date();
        const { day } = getDateYMD(date);
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
        res.status(200).send({ success: true, data })
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
