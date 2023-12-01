/*
COLLABORATION CONTROLLER

here we add the collaboration logic
a route for adding a person to the article
a route for the person to accept the adding request
a route for the person to decline the adding request
---
How collbrations are going to work
first you need to add the person to the article collbrations list with a pending status.
then if the user wants to be in that article he will accept else he will refuse it.
if the user accept the request he will be allowed to edit.
we will create a speical route for the accepting the request by editing that detail in the article collbrations list list
*/
import Article from "../models/article";
import { IRequestWithUser } from "../interfaces/global";
import { Response } from "express";
//Person who wants to add a collaboration
const addCollaboration = async (req: IRequestWithUser, res: Response) => {
    try {
        const user = req.user;
        const { collaboratorId,canDelete, articleId } = req.body;
        if (String(user._id) === collaboratorId)
            return res.status(401).send({ success: false, message: "لا يمكنك اضافة تعاون مع نفسك" })
        const updateStatus = await Article.updateOne({ _id: articleId, publisher: user._id, "collaborators.collaborator": { $ne: collaboratorId } }, {
            $push: {
                collaborators: {
                    collaborator: collaboratorId,
                    canDelete:canDelete || false,
                    createdAt: new Date(),
                }
            }
        });
        
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        res.status(201).send({ success: true, message: "تم اضافة المستخدم الى قائمة التعاون" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })

    }
}
const cancleCollaboration = async (req: IRequestWithUser, res: Response) => {
    try {
        const { collaboratorId, articleId } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.collaborator": collaboratorId, "collaborators.accepted": false }, {
            $pull: {
                collaborators: {
                    collaborator: collaboratorId
                }
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        res.status(201).send({ success: true, message: "تم حذف المستخدم من قائمة التعاون" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}
//Person who wants to accept a collaboration
const acceptCollaboration = async (req: IRequestWithUser, res: Response) => {
    try {
        const user = req.user;
        const { articleId } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.collaborator": user._id }, {
            $set: {
                "collaborators.$.accepted": true
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        res.status(201).send({ success: true, message: "تم قبول الطلب" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}
const denyCollaboration = async (req: IRequestWithUser, res: Response) => {
    try {
        const user = req.user;
        const { articleId } = req.body;
        const updateStatus = await Article.updateOne({ _id: articleId, "collaborators.collaborator": user._id }, {
            $pull: {
                collaborators: {
                    collaborator: user._id
                }
            }
        });
        if (updateStatus.modifiedCount === 0)
            return res.status(401).send({ success: false, message: "حدث خطا ما" })
        res.status(201).send({ success: true, message: "تم رفض الطلب" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}
export {
    addCollaboration,
    cancleCollaboration,
    acceptCollaboration,
    denyCollaboration,
}