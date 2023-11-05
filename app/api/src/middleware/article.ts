import {Request, Response, NextFunction} from "express";
import Article from "../models/article";
import {IRequestWithArticle} from "interfaces/global";
export const isOwner = (expectedStatus : boolean) => {
    try {
        return async (req : IRequestWithArticle, res : Response, next : NextFunction) => {
            const user = req.user;
            const articleId = req.body.articleId;
            const article = await Article.findOne({_id:articleId, publisher:user._id});  
            switch (true) {
                case article && expectedStatus:
                    req.article = article;
                    return next();
                case !article && !expectedStatus:
                    req.article = article;
                    return next();
                case article && !expectedStatus:
                    return res.status(401).send({success: false, message: "غير مصرح لا يمكنك اتمام هذا الاجراء 1"});
                case !article && expectedStatus:
                    return res.status(401).send({success: false, message: "غير مصرح لا يمكنك اتمام هذا الاجراء 2"});
            }
        }
    } catch (err) {
        console.log(err);
    }
}
