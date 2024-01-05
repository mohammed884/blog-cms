import { Request, Response } from "express";
import pagination from "../../helpers/pagination";
import Notification from "./model";
import { Types } from "mongoose";
import { formatDateToYMD } from "../../helpers/date";
interface ISendNotifications {
    receiver: string;
    sender: Types.ObjectId;
    article?: Types.ObjectId | string;
    retrieveId: string;
    type: "follow" | "comment" | "reply" | "collaboration-request" | "collaboration-accept" | "collaboration-deny";
}
interface IDeleteNotifications {
    receiver: string;
    retrieveId: Types.ObjectId | string;
}
const getNotifications = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const page = Number(req.query.page) || 1;
        const matchQuery = {
            receiver: user._id
        };
        const result = await pagination({ matchQuery, page, Model: Notification });
        res.status(401).send({ success: true, notifications: result.data });
    } catch (err) {
        console.log(err);

    }
};
const getUnSeenNotificationsCount = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const count = await Notification.countDocuments({
            receiver: user._id,
            "comments.seen": false
        });
        res.status(401).send({ success: true, count });
    } catch (error) {
        console.log();
        res.status(401).send({ success: false, message: "Internal server error" });
    }
}
const sendNotification = async ({ receiver, sender, article, retrieveId, type }: ISendNotifications): Promise<{ success: boolean, err?: string }> => {
    try {
        if (receiver === String(sender)) return {
            success: true,
        };
        const updateStatus = await Notification.updateOne(
            {
                receiver,
                count: { $lt: 50 }
            }, {
            $push: {
                notifications: {
                    sender,
                    article,
                    retrieveId,
                    type,
                    createdAt: formatDateToYMD(new Date(), "_"),
                }
            },
            $inc: {
                notificationsCount: 1
            }
        });
        if (updateStatus.matchedCount === 0) {
            const createdAt = formatDateToYMD(new Date(), "_")
            Notification.create({
                receiver,
                notifications: {
                    sender,
                    article,
                    retrieveId,
                    type,
                    createdAt
                },
                notificationsCount: 1,
                createdAt
            });
        }
        return { success: true };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            err: err.message
        };
    }
};
const deleteNotification = async ({ receiver, retrieveId }: IDeleteNotifications) => {
    try {
        const updateStatus = await Notification.updateOne({ receiver, "notifications.retrieveId": retrieveId },
            {
                $pull: {
                    notifications: {
                        retrieveId
                    }
                },
                $inc: {
                    notificationsCount: -1
                }
            });
        if (updateStatus.modifiedCount === 0) {
            return {
                success: false,
                err: "unable to delete the Notifications"
            };
        }
        return {
            success: true,
            err: "Notifications deleted"
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            err: err.message,
        };
    }
}
export {
    getNotifications,
    getUnSeenNotificationsCount,
    sendNotification,
    deleteNotification,
}