import Notification from "./model";
import { Types } from "mongoose";
/*
1- send Notifications
DATA TO SHOW
A-it's a comment
article image, a message, sender (username & image)
B-it's a reply
article image, a message, sender (username & image)
C-it's a collaboration
article image, a message, sender (username & image)
NEEDS 
receiver, sender, message, article, Notifications retrieveId field, type
---
2-delete Notifications
NEEDS
retrieveId,receiver
first we use the receiver id to minimize the documents 
then we use the retrieveId to delete it
*/
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
const sendNotification = async ({ receiver, sender, article, retrieveId, type }: ISendNotifications) => {
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
                    createdAt: new Date(),
                }
            },
            $inc: {
                notificationsCount: 1
            }
        });
        if (updateStatus.matchedCount === 0) {
            Notification.create({
                receiver,
                notifications: {
                    sender,
                    article,
                    retrieveId,
                    type,
                    createdAt: new Date(),
                },
                notificationsCount: 1
            });
        }
        return {
            success: true,
            err: "Notifications pushed"
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message
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
    sendNotification,
    deleteNotification,
}