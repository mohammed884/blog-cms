import { Request, Response, NextFunction } from "express";
import Article from "../domains/article/model";
export const isOwner = (expectedStatus: boolean, expectedOwner?: string) => {
    try {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;
            const articleId = req.params.id;
            const article = await Article.findOne({
                _id: articleId,
                $or: [{ publisher: expectedOwner || user._id },
                { "collaborators.accepted": true, "collaborators.collaborator": expectedOwner || user._id }]
            });
            switch (true) {
                case article && expectedStatus:
                    req.article = article;
                    return next();
                case !article && !expectedStatus:
                    req.article = article;
                    return next();
                case article && !expectedStatus:
                    return res.status(401).send({ success: false, message: "غير مصرح لا يمكنك اتمام هذا الاجراء 1" });
                case !article && expectedStatus:
                    return res.status(401).send({ success: false, message: "غير مصرح لا يمكنك اتمام هذا الاجراء 2" });
            }
        }
    } catch (err) {
        console.log(err);
    }
}
