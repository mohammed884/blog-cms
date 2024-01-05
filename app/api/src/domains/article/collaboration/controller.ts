import { Request, Response } from "express";
import { deleteNotification, sendNotification } from "../../notification/controller";
import Article from "../models/article";
import { formatDateToYMD } from "../../../helpers/date";
//send, cancle sending a collaboration
const addCollaboration = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { collaboratorId, articleId, canDelete } = req.body;
        if (String(user._id) === collaboratorId)
            return res.status(401).send({ success: false, message: "لا يمكنك التعاون مع نفسك" })
        const article = await Article.findOneAndUpdate({
            publisher: user._id,
            _id: articleId,
            "collaborators.collaborator": { $ne: collaboratorId }
        },
            {
                $push: {
                    collaborators: {
                        collaborator: collaboratorId,
                        canDelete: canDelete || false,
                        createdAt: formatDateToYMD(new Date(), "_"),
                    }
                }
            },
            { new: true }
        ).lean();
        if (!article) {
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        }
        const notificationStatus = await sendNotification({
            receiver: collaboratorId,
            sender: user._id,
            article: articleId,
            retrieveId: String(article.collaborators[article.collaborators.length - 1]._id),
            type: "collaboration-request",
        });
        if (!notificationStatus.success) {
            return res.status(500).send({ success: false, message: notificationStatus.err })
        }
        res.status(201).send({ success: true, message: "تم ارسال طلب التعاون الى المستخدم" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const cancleCollaboration = async (req: Request, res: Response) => {
    try {
        const { collaboratorId, collaborationId, articleId } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.collaborator": collaboratorId, "collaborators.accepted": false }, {
            $pull: {
                collaborators: {
                    collaborator: collaboratorId
                }
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        const notificationStatus = await deleteNotification({
            receiver: collaboratorId,
            retrieveId: collaborationId,
        });
        if (!notificationStatus.success) {
            res.status(500).send({ success: false, message: notificationStatus.err })
        }
        res.status(201).send({ success: true, message: "تم حذف المستخدم من قائمة التعاون" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
};
//accept, deny a collaboration
const acceptCollaboration = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { articleId, collaborationId, articlePublisher } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.accepted": false, "collaborators.collaborator": user._id }, {
            $set: {
                "collaborators.$.accepted": true
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        const notificationStatus = await sendNotification({
            receiver: articlePublisher,
            sender: user._id,
            article: articleId,
            retrieveId: collaborationId,
            type: "collaboration-accept",
        });
        if (!notificationStatus.success) {
            return res.status(500).send({ success: false, message: notificationStatus.err })
        }
        res.status(201).send({ success: true, message: "تم قبول الطلب" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
};
const denyCollaboration = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { articleId, collaborationId } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.accepted": false, "collaborators.collaborator": user._id }, {
            $pull: {
                collaborators: {
                    collaborator: user._id
                }
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        const notificationStatus = await deleteNotification({
            receiver: String(user._id),
            retrieveId: collaborationId,
        });
        if (!notificationStatus.success) {
            res.status(500).send({ success: false, message: notificationStatus.err })
        }
        res.status(201).send({ success: true, message: "تم رفض الطلب" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
};
export {
    addCollaboration,
    cancleCollaboration,
    acceptCollaboration,
    denyCollaboration,
};