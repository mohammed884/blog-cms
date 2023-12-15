import { Response, Request } from "express";
import { addArticleSchema } from "../../validation/article";
import Article from "./model";
import Like from "./like/model";
import { ObjectId } from "bson";
import { uploadSingle, deleteSingle } from "../../helpers/fileopreations";
import isUserBlocked from "../../helpers/isUserBlocked";
import { countData, pagination } from "../../helpers/aggregation";
interface IAddPostBody {
  title: string;
  content: object;
  topics: [];
}

const getFeed = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const matchQuery = {
      "topics.mainTopic": { $in: user.topics.map(topic => topic.title) },
    };
    const result = await pagination({ matchQuery, Model: Article, page });
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
    const result = await pagination({ matchQuery, Model: Article, page });
    res.status(201).send({ success: true, articles: result.data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
const getPublisherArticlesCount = async (req: Request, res: Response) => {
  try {
    const publisherId = req.params.publisherId;
    if (!publisherId) {
      return res.status(401).send({ success: false, message: "Please provide the publisher ID" });
    }
    const matchQuery = { publisher: new ObjectId(publisherId) };
    const dataCount = await countData({ matchQuery, Model: Article, countDocuments: true });
    res.status(201).send({ success: true, count: dataCount.documentsCount });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
}
const getArticle = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    if (!articleId)
      return res.status(401).send({ message: "لم يتم العثور على مقالة" });

    const article = await Article.findById({ _id: articleId }).populate("publisher", "username avatar blocked");
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على هذه المقالة" });
    const publisher: any = article.publisher;

    if (req.user && req.user._id !== article.publisher._id) {
      const isBlocked = isUserBlocked(publisher.blocked, String(req.user._id));
      if (isBlocked) return res.status(401).send({ success: false, isBlocked: true, message: "لقد تم حظرك من هذه المقالة" });
    }
    res.status(201).send({ success: true, article, publisher });
  } catch (err) {
    console.log(err);
  }
};
const searchArticles = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const title: any = req.query.title;
    const topics = req.query.topics;
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
    const result = await pagination({ matchQuery, Model: Article, page })
    res.status(201).send({ success: true, articles: result.data });
  } catch (err) {
    console.log(err);
  }
};
const addArticle = async (req: Request, res: Response) => {
  try {
    //you should make sure that the content isn't empty after implementing the frontend
    const body: IAddPostBody = req.body;
    await addArticleSchema.validateAsync(body);
    //upload cover
    if (req.files && req.files.cover) {
      const uploadStatus = uploadSingle(req.files.cover);
      if (!uploadStatus.success) return res.status(401).send({ success: false, message: uploadStatus.err });
      var filePath = uploadStatus.path || "";
    }

    const article = await Article.create({
      ...body,
      publisher: req.user._id,
      estimatedReadTime: "5 mins",
      cover: filePath,
    });
    res.status(201).send({ success: true, article, message: "تم نشر المقالة" });
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
    const { title, content, topics } = req.body;
    const article = req.article;
    const files = req.files;
    if (title && title !== article.title) article.title = title;
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
    const user = req.user;
    const articleId = req.params.id;
    const article = await Article.findById({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });

    const isSavedBefore = user.saved.find(
      (s) => String(s.article) === String(articleId)
    );
    if (isSavedBefore) {
      user.saved = user.saved.filter(
        (s) => String(s.article) !== String(articleId)
      );
      article.savedCount--;
      await article.save();
      await user.save();
      return res
        .status(201)
        .send({ success: true, message: "تم الازالة من المحفوظة" });
    } else {
      user.saved.push({ article: new ObjectId(articleId), createdAt: new Date() });
      article.savedCount++;
      await article.save();
      await user.save();
      return res
        .status(201)
        .send({ success: true, message: "تم الاضافة الى المحفوظة" });
    }
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
    if (!article) res.status(201).send({ success: false, message: "لا يوجد مقالة بهذا المعرف" });
    if (article.cover) deleteSingle(article.cover);
    res.status(201).send({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server error" });
  }
};
export {
  getFeed,
  getArticle,
  searchArticles,
  addArticle,
  editArticle,
  deleteArticle,
  saveArticle,
  getPublisherArticles,
  getPublisherArticlesCount,
};
