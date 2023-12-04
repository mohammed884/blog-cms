import Notification from "../models/notification";
import { Types } from "mongoose";
/*
1- send notifiction
DATA TO SHOW
A-it's a comment
article image, a message, sender (username & image)
B-it's a reply
article image, a message, sender (username & image)
C-it's a collaboration
article image, a message, sender (username & image)
NEEDS 
receiver, sender, message, article, notifiction retrieveId field, type
---
2-delete notifiction
NEEDS
retrieveId,receiver
first we use the receiver id to minimize the documents 
then we use the retrieveId to delete it
*/
interface ISendNotifiction {
    receiver: Types.ObjectId;
    sender: Types.ObjectId;
    article: Types.ObjectId;
    retrieveId: string;
    type: "comment" | "reply" | "collaboration";
}
interface IDeleteNotifiction {
    receiver: Types.ObjectId,
    retrieveId: Types.ObjectId,
    // type: "comment" | "reply" | "collaboration";
}
const sendNotifiction = async ({ receiver, sender, article, retrieveId, type }: ISendNotifiction) => {
    try {
        if (receiver === sender) return {
            success:false,
            message:"you can't send notifiction to your account"
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
            return {
                success: true,
                message: "notifiction pushed"
            };
        } else {

            return {
                success: true,
                message: "notifiction pushed"
            };
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message
        };
    }
};
const deleteNotifiction = async ({ receiver, retrieveId }: IDeleteNotifiction) => {
    try {
        console.log(retrieveId);
        
        //i need to make the query more specific depending on the type
        const updateStatus = await Notification.updateOne({ receiver, "notifications.retrieveId":retrieveId },
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
                message: "unable to delete the notifiction"
            };
        }
        return {
            success: true,
            message: "notifiction deleted"
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message,
        };
    }
}
export {
    sendNotifiction,
    deleteNotifiction,
}