import { Response, Request } from "express";
import { addArticleSchema } from "../validation/article";
import Article from "./model";
import Like from "../models/like";
import { IRequestWithArticle, IRequestWithUser } from "../interfaces/global";
import { ObjectId } from "mongodb";
import { uploadSingle, deleteSingle } from "../helpers/fileopreations";
interface IAddPostBody {
  title: string;
  content: object;
  topics: [];
}

// ARTICLES FUNCTIONALITY
// get articles/article, search/filter , add, edit, like, save, delete.
const getArticles = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const limt = 10;
    const skip = (Number(page) - 1) * limt;
    const articles = await Article.aggregate([
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limt,
            },
          ],
        },
      },
    ]);
    res.status(201).send({ success: true, articles: articles[0].data });
  } catch (err) {
    console.log(err);
  }
};
const getArticle = async (req: Request, res: Response) => {
  try {
    const articleId = req.body.articleId;
    if (!articleId)
      return res.status(401).send({ message: "لم يتم العثور على مقالة" });

    const article = await Article.findOne({ _id: articleId }).lean();
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على هذه المقالة" });

    res.status(201).send({ success: true, article });
  } catch (err) {
    console.log(err);
  }
};
const searchArticles = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const title: any = req.query.title;
    const topics = req.query.topics;
    const limt = 10;
    const skip = (Number(page) - 1) * limt;
    if (!title && !Array.isArray(topics))
      return res.status(401).send({
        success: false,
        message: "الرجاء توفير عنوان او اهتمامات للبحث",
      });
    let searchOptions = {};
    if (title) {
      searchOptions = { ...searchOptions, title: new RegExp(title, "i") }
    }
    if (typeof topics === "string" && topics.length > 0) {
      searchOptions = { ...searchOptions, topics: { $in: topics.split("-") } }
    };
    const articles = await Article.aggregate([
      { $match: searchOptions },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limt,
            },
          ],
        },
      },
    ]);
    res.status(201).send({ success: true, articles: articles[0].data });
  } catch (err) {
    console.log(err);
  }
};
const addArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    //you should make sure that the content isn't empty after implementing the frontend
    const body: IAddPostBody = req.body;
    await addArticleSchema.validateAsync(body);
    //upload cover
    if (req.files && req.files.cover) {
      const uploadStatus = uploadSingle(req.files.cover);
      if (!uploadStatus.success) return res.status(401).send({ success: false, message: uploadStatus.err });
      var filePath = uploadStatus.path;
    }
    const article = await Article.create({
      ...body,
      publisher: req.user._id,
      estimatedReadTime: "5 mins",
      cover: filePath || "",
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
const editArticle = async (req: IRequestWithArticle, res: Response) => {
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
const likeArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.id;
    const article = await Article.findOne({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });

    const likesBucket = await Like.findOne({ article: articleId, likesCount: { $lt: 50 } });
    if (!likesBucket) {
      await Like.create({
        article: articleId,
        likes: [
          {
            user: user._id,
            createdAt: new Date()
          }
        ],
        likesCount: 1,
      });
      article.likesCount++;
      await article.save();
      return res.status(201).send({ success: true, message: "تم اضافة الاعجاب" })
    };

    const isLikedBefore = likesBucket.likes.some((like) => String(like.user) === String(user._id));
    switch (true) {
      case isLikedBefore:
        likesBucket.likes = likesBucket.likes.filter(like => String(like.user) !== String(user._id));
        likesBucket.likesCount--;
        article.likesCount--;
        await likesBucket.save();
        await article.save();
        return res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
      case !isLikedBefore:
        likesBucket.likes = [...likesBucket.likes, { user: user._id, createdAt: new Date() }];
        likesBucket.likesCount++;
        article.likesCount++;
        await likesBucket.save()
        await article.save()
        return res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
      default:
        return res.status(401).send({ success: false, message: "حدث خطأ ما" })
    }
  } catch (err) {
    console.log(err);
  }
};
const saveArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.id;
    const article = await Article.findOne({ _id: articleId });
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
const deleteArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.id;
    if (!articleId)
      return res
        .status(401)
        .send({ success: true, message: "الرجاء توفير معرف المقالة" });
    const article = await Article.findOne({
      _id: articleId,
      $or: [
        { publisher: user._id },
        { "collaborators.collaborator": user._id, "collaborators.accepted": true, "collaborators.canDelete": true }
      ]
    });
    if (!article) res.status(201).send({ success: false, message: "لا يوجد مقالة بهذا المعرف" });
    if (article.cover) deleteSingle(article.cover);
    const deletionStatus = await Article.deleteOne({ _id: articleId });
    if (!deletionStatus.acknowledged)
      return res.status(501).send({ success: false, message: "حدث خطا ما" });
    res.status(201).send({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server error" });
  }
};
export {
  getArticle,
  getArticles,
  searchArticles,
  addArticle,
  editArticle,
  deleteArticle,
  likeArticle,
  saveArticle,
};
