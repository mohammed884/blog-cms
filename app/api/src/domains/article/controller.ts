import { Response, Request } from "express";
import Article from "./models/article";
import Reader from "./models/reader";
import Like from "./like/model";
import Comment from "./comment/model";
import { PipelineStage } from "mongoose";
import { ObjectId } from "bson";
import { addArticleSchema } from "../../validation/article";
import { uploadSingle, deleteSingle } from "../../helpers/fileopreations";
import pagination from "../../helpers/pagination";
import { getDateYMD, getMonthLength, formatDateToYMD } from "../../helpers/date";
import dayjs from "dayjs";
import { getUserFromToken } from "../../helpers/jwt";
import { redisClient, getOrSetCache, setRedisCache, delCache } from "../../redis-cache";
import { USER_ID_KEY, USER_SAVED_ID_KEY, USER_USERNAME_KEY } from "../../redis-cache/keys";
import { USER_CACHE_EXPIARY, USER_SAVED_CACHE_EXPIARY } from "../../redis-cache/expiries";
import sanitizeHtml from 'sanitize-html';
import Topic from "../topic/model";
import { nanoid } from "nanoid";
interface IPublishPostBody {
  title: string;
  subTitle: string;
  content: string;
  topics: string;
};
const getTopArticles = async (req: Request, res: Response) => {
  try {
    // get top 6 articles and cache it    
    const startOfTheWeek = new Date(dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"));
    const endOfTheWeek = new Date(dayjs().endOf("week").format("YYYY-MM-DD"));
    const likePipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: {
            $gte: startOfTheWeek,
            $lte: endOfTheWeek,
          }
        }
      },
      {
        $group: {
          _id: "$article",
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1,
        }
      },
      {
        $limit: 6
      }
    ];
    const ids = await Like.aggregate(likePipeline);
    const articleIds = ids.map(id => new ObjectId(id._id));
    const articlePipeline: PipelineStage[] = [
      {
        $match: {
          _id: {
            $in: articleIds
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "publisher",
          foreignField: "_id",
          as: "publisher",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          title: 1,
          createdAt: 1,
          publisher: 1,
          readTime: 1,
        }
      }
    ];
    const articles = await Article.aggregate(articlePipeline);
    res.status(201).send({ success: true, articles });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const getFeed = async (req: Request, res: Response) => {
  try {
    //test getFeed option
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const matchQuery = {
      $or: [
        { "topics.mainTopic": { $in: user?.topics || [] } },
        {},
      ],
    }
    const result = await pagination({
      matchQuery,
      page,
      limit: 5,
      populate: {
        from: "users",
        foreignField: "_id",
        localField: "publisher",
        select: {
          username: 1,
          avatar: 1,
          blocked: 1
        },
        as: "publisher"
      },

      articleBlockChecking: user ? { userIdToCheck: user._id } : {},
      Model: Article,
    });
    res.status(201).send({ success: true, articles: result.data });
  } catch (error) {
    console.error(error);
  }
};
const getPublisherArticles = async (req: Request, res: Response) => {
  try {
    const publisherId = req.params.publisherId;
    const page = Number(req.query.page) || 1;
    if (!publisherId) {
      return res.status(401).send({ success: false, message: "Please provide the publisher ID" });
    }
    const matchQuery = { publisher: new ObjectId(publisherId) };
    const result = await pagination({
      matchQuery, select: {
        content: 0,
        collaborators: 0,
        savedCount: 0,
      }, Model: Article, page, limit: 5,
    });
    res.status(201).send({ success: true, articles: result.data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
const getSavedArticles = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const savedArticlesIds = user.saved.map(saved => saved.article);
    const cacheCb = async () => {
      return (
        await Article
          .find({ _id: { $in: savedArticlesIds } })
          .populate("publisher", "username avatar")
          .select("-content -collaborators -savedCount")
      )
    }
    const savedArticles = await getOrSetCache(
      redisClient,
      `${USER_SAVED_ID_KEY}=${user._id}`,
      cacheCb,
      USER_SAVED_CACHE_EXPIARY
    );
    res.status(201).send({ success: true, articles: savedArticles })
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" })
  }
};
const getPublisherArticlesCount = async (req: Request, res: Response) => {
  try {
    const publisherId = req.params.publisherId;
    if (!publisherId) {
      return res.status(401).send({ success: false, message: "Please provide the publisher ID" });
    }
    const count = await Article.countDocuments({ publisher: new ObjectId(publisherId) });
    res.status(201).send({ success: true, count });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
const getArticle = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "publisher",
          foreignField: "_id",
          as: "publisher",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1
              }
            },
          ]
        }
      }
    ]
    const article = req.article
      ||
      await Article.aggregate(pipeline);
    console.log(article);

    res.status(201).send({ success: true, article: article[0] });
  } catch (err) {
    console.log(err);
  }
};
const searchArticles = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const title: any = req.query.title;
    const topics = req.query.topics;
    if (!user) {
      return res.status(401).send({ success: false, message: "يجب عليك تسجيل الدخول" });
    }
    if (!title && !Array.isArray(topics))
      return res.status(401).send({
        success: false,
        message: "الرجاء توفير عنوان او اهتمامات للبحث",
      });
    let matchQuery = {};
    if (title) {
      matchQuery = { ...matchQuery, title: new RegExp(title, "i") }
    }
    if (typeof topics === "string" && topics.length > 0) {
      matchQuery = { ...matchQuery, topics: { $in: topics.split("-") } }
    };
    const result = await pagination({
      matchQuery,
      page,
      populate: {
        from: "users",
        foreignField: "_id",
        localField: "publisher",
        select: {
          username: 1,
          avatar: 1,
          blocked: 1
        },
        as: "publisher"
      },
      articleBlockChecking: { userIdToCheck: user._id },
      Model: Article,
    });
    res.status(201).send({ success: true, articles: result.data });
  } catch (err) {
    console.log(err);
  }
};
const publishArticle = async (req: Request, res: Response) => {
  try {
    //you should make sure that the content isn't empty after implementing the frontend
    const body: IPublishPostBody = req.body;
    const topics = JSON.parse(body.topics);
    await addArticleSchema.validateAsync({ ...body, topics });
    const topicsCount = await Topic.countDocuments({ title: { $in: topics } });
    if (topics.length !== topicsCount) return res.status(401).send({ success: false, message: "الرجاء التاكد من الاهتمامات المعطاة" })
    let filePath: string;

    if (req.files && req.files.cover) {
      const uploadStatus = uploadSingle(req.files.cover);
      if (!uploadStatus.success) return res.status(401).send({ success: false, message: uploadStatus.err });
      filePath = uploadStatus.path || "";
    };
    const sanatizedContent = sanitizeHtml(body.content);
    if (sanatizedContent.length < 5) return res.status(403).send({
      success: false,
      message: "الرجاء كتابة المحتوى"
    })
    const article = await Article.create({
      title: `${body.title}-${nanoid()}`,
      subTitle: body.subTitle,
      publisher: req.user._id,
      estimatedReadTime: "5 mins",
      cover: filePath,
      createdAt: formatDateToYMD(new Date(), "_"),
      content: sanatizedContent,
      topics: topics.map(t => ({ mainTopic: t })),
    });
    res.status(201).send({ success: true, title: article.title, message: "تم نشر المقالة" });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      const { message, context } = err.details[0];
      res.status(401).send({ success: false, message, context });
    } else {
      res.status(501).send({ success: false, message: "حدث خطا ما" })
    }
  }
};
const editArticle = async (req: Request, res: Response) => {
  try {
    //edit need work to be done here
    const { title, subTitle, content, topics } = req.body;
    const article = req.article;
    const files = req.files;
    if (title && title !== article.title) article.title = title;
    if (subTitle && subTitle !== article.subTitle) article.subTitle = subTitle;
    if (content && JSON.stringify(content) !== JSON.stringify(article.content)) article.content = content;
    if (topics && topics.toString() !== article.topics.toString()) article.topics = topics;
    if (files && files.cover) {
      const uploadStatus = uploadSingle(files.cover);
      if (!uploadStatus.success)
        return res
          .status(401)
          .send({ success: false, message: uploadStatus.err });
      article.cover = uploadStatus.path;
    };
    await article.save();
    res.status(201).send({ success: true, message: "تم تحديث المعلومات" })
  } catch (err) {
    console.log(err);
  }
};
const saveArticle = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.access_token;
    const user = await getUserFromToken(accessToken);
    if (!user) return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم" })
    const articleId = req.params.id;
    const article = await Article.findById({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });
    let message: string
    const isSavedBefore = user.saved.find(
      (s) => s.article === articleId
    );
    if (isSavedBefore) {
      article.savedCount--;
      await article.save();
      user.saved = user.saved.filter(
        (s) => s.article !== articleId
      );
      await user.save()
      message = "تم الازالة من المحفوظة"
    } else {
      article.savedCount++;
      await article.save();
      user.saved.push({ article: articleId, createdAt: formatDateToYMD(new Date(), "_") });
      await user.save()
      message = "تم الاضافة الى المحفوظة"
    }
    setRedisCache(redisClient, `${USER_USERNAME_KEY}=${user.username}`, user, USER_CACHE_EXPIARY)
    setRedisCache(redisClient, `${USER_ID_KEY}=${user._id}`, user, USER_CACHE_EXPIARY)
    delCache(redisClient, `${USER_SAVED_ID_KEY}=${user._id}`)
    return res
      .status(201)
      .send({ success: true, message });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const deleteArticle = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.id;
    if (!articleId)
      return res
        .status(401)
        .send({ success: true, message: "الرجاء توفير معرف المقالة" });
    const article = await Article.findOneAndDelete({
      _id: articleId,
      $or: [
        { publisher: user._id },
        { "collaborators.accepted": true, "collaborators.collaborator": user._id, "collaborators.canDelete": true }
      ]
    });
    if (!article) return res.status(201).send({ success: false, message: "الرجاء التاكد من المعلومات المعطاة" });
    if (article.cover) deleteSingle(article.cover);
    await Like.deleteMany({ article: articleId });
    await Comment.deleteMany({ article: articleId });
    res.status(201).send({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server error" });
  }
};
const addReader = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.articleId;
    const readTime = req.body.readTime;
    if (!articleId) {
      return res
        .status(401)
        .send({ success: false, message: "Please provide article id" });
    };
    if (!readTime) {
      return res
        .status(401)
        .send({ success: false, message: "Please provide read time" });
    }
    const article = await Article.findById(articleId);
    if (!article) {
      return res
        .status(401)
        .send({ success: false, message: "Article not found" });
    }
    await Reader.create({
      article: articleId,
      articlePublisher: article.publisher,
      user: user._id,
      readTime,
      createdAt: formatDateToYMD(new Date(), "_"),
    });
    res.status(201).send({ success: true, message: "Added successfully" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res
        .status(401)
        .send({ success: false, message: "Reader Already added" });
    }
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
const readersAnalysis = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.articleId;
    if (!articleId) {
      return res
        .status(401)
        .send({ success: false, message: "Please provide article id" });
    }
    const date = req.params.date;
    const { year, month } = getDateYMD(new Date(date))
    const monthLength = getMonthLength(year, month);
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
                totalReadTime: { $sum: "$readTime" }
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
                totalReadTime: { $sum: "$readTime" }
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
                totalReadTime: { $sum: "$readTime" }
              }
            }
          ]
        }
      }
    ]
    const data = await Reader.aggregate(pipeline)
    res.status(201).send({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  };
};
export {
  getTopArticles,
  getFeed,
  getArticle,
  searchArticles,
  publishArticle,
  editArticle,
  deleteArticle,
  saveArticle,
  getPublisherArticles,
  getSavedArticles,
  getPublisherArticlesCount,
  addReader,
  readersAnalysis,
};
