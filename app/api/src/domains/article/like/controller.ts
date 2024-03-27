import { Request, Response } from "express";
import Article from "../models/article";
import Like from "./model";
import pagination from "../../../helpers/pagination";
import { getDateYMD, formatDateToYMD, getMonthLength } from "../../../helpers/date";
const likeArticle = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const articleId = req.params.id;
        const action = req.query.action;
        if (!action || !articleId) {
            return res.status(401).send({ success: false, message: "Please provide an action" })
        };
        const article = await Article.findById(articleId).select("publisher");
        if (!article) {
            return res.status(401).send({ success: false, message: "Article not found" })
        };
        switch (action) {
            case "add":
                await Like.create({
                    article: articleId,
                    articlePublisher: article.publisher,
                    user: user._id,
                    createdAt: formatDateToYMD(new Date(), "_")
                });
                res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
                break;
            case "remove":
                const deleteLikeStatus = await Like.deleteOne({ article: articleId, user: user._id });
                if (deleteLikeStatus.deletedCount === 0) {
                    return res.status(401).send({ success: false, message: "لا يوجد اعجاب ليتم ازالة" });
                }
                res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
                break;
        }
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.status(401).send({ success: false, message: "لقد اعجبت بالمقال سابقا" });
        } else {
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    }
};
const getLikes = async (req: Request, res: Response) => {
    try {
        const articleId = req.params.articleId;
        const page = Number(req.query.page) || 1;
        const matchQuery = { article: articleId };
        const result = await pagination({
            matchQuery,
            Model: Like,
            page: page,
            limit: 1,
        });

        res.status(200).send({ success: true, likes: result.data });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};
const getLikesCount = async (req: Request, res: Response) => {
    try {
        const articleId = req.params.articleId;
        const count = Like.countDocuments({ article: articleId })
        res.status(200).send({ success: true, count });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};
const likeAnalysis = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const articleId = req.params.articleId;
        if (!articleId) {
            return res
                .status(401)
                .send({ success: false, message: "Please provide article id" });
        };
        const article = await Article.findOne({ articleId, publisher: user._id }).select("_id");
        if (!article) {
            return res
                .status(401)
                .send({ success: false, message: "Article not found" });
        };
        const date = String(req.query.date);
        if (!date) {
            return res
                .status(401)
                .send({ success: false, message: "Please provide date" });
        };
        const { year, month, day } = getDateYMD(new Date(date))
        const monthLength = getMonthLength(year, month)
        const dateList = formatDateToYMD(date, [1, 15, monthLength], "DATE");
        const pipeline = [
            {
                $match: {
                    articlePublisher: user._id,
                    article: articleId,
                    createdAt: {
                        $gte: dateList[0],
                        $lte: dateList[2],
                    }
                }
            },
            {
                $facet: {
                    start: [
                        {
                            $match: {
                                createdAt: dateList[0]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
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
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            }
                        }
                    ],
                    last: [
                        {
                            $match: {
                                createdAt: {
                                    $gt: dateList[1],
                                    $lte: dateList[2],
                                },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            }
                        }
                    ]
                }
            }
        ];
        const data = await Like.aggregate(pipeline)
        res.status(201).send({ success: true, data });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};
export {
    likeArticle,
    getLikes,
    getLikesCount,
    likeAnalysis
};