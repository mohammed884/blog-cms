import { Response, Request } from "express";
import { addArticleSchema } from "../validation/article";
import Article from "../models/article";
import Like from "../models/like";
import dayjs from "dayjs";
import { IRequestWithUser } from "interfaces/global";
interface IAddPostBody {
  title: string;
  content: object;
  interests: [];
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
    const { title, active, interests } = req.body.title;
    const limt = 10;
    const skip = (Number(page) - 1) * limt;
    if (!title && !Array.isArray(interests))
      return res.status(401).send({
        success: false,
        message: "الرجاء توفير عنوان او اهتمامات للبحث",
      });
    const searchOptions = {
      active: active ? active : false,
      title,
      interests: { $in: { interests } },
    };
    searchOptions.title = new RegExp(title, "i");
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
    const body: IAddPostBody = req.body;
    await addArticleSchema.validateAsync(body);
    const article = await Article.create({
      ...body,
      createdAt:new Date(),
      publisher: req.user._id,
      estimatedReadTime: "5 mins",
    });
    res.status(201).send({ success: true, article, message: "تم نشر المقالة" });
  } catch (err) {
    if (err.isJoi) {
      const { message, context } = err.details[0];
      res.status(401).send({ succesfull: false, message, context });
    } else console.log(err);
  }
};
const editArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const articleId = req.body.articleId;
    await Article.updateOne(
      {
        _id: articleId,
      },
      {
        $set: {
          title: body.title,
          content: body.content,
          interests: body.interests,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
const likeArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.body.articleId;
    const article = await Article.findOne({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });
    //if the user didn't like the article before
    const updateStatus = await Like.updateOne(
      {
        article: articleId,
        "likes.user": { $ne: user._id },
        count: {
          $lt: 50,
        },
      },
      {
        $push: {
          likes: {
            user: user._id,
            createdAt: new Date(),
          },
        },
        $inc: {
          likesCount: 1,
        },
      }
    );
    if (updateStatus.modifiedCount === 1) {
      article.likesCount++;
      await article.save();
      res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
    } else {
      //if the user liked the article before
      const updateStatus = await Like.updateOne(
        {
          article: articleId,
          "likes.user": user._id,
          count: {
            $lt: 50,
          },
        },
        {
          $pull: {
            likes: {
              user: user._id,
            },
          },
          $inc: {
            likesCount: -1,
          },
        }
      );
      if (updateStatus.modifiedCount === 1) {
        article.likesCount--;
        await article.save();
        res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
      } else {
        //if there is no bucket and the user didn't like the article before
        console.log("create a bucket");

        await Like.create({
          article: articleId,
          likes: [
            {
              user: user._id,
              createdAt: new Date(),
            },
          ],
          likesCount: 1,
        });
        article.likesCount++;
        await article.save();
        res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
const saveArticle = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.body.articleId;
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
      user.saved.push({ article: articleId, createdAt: new Date() });
      article.savedCount++;
      await article.save();
      await user.save();
      return res
        .status(201)
        .send({ success: true, message: "تم الاضافة الى المحفوظة" });
    }
  } catch (err) {
    console.log(err);
  }
};
const deleteArticle = async (req: Request, res: Response) => {
  try {
    const articleId = req.body.articleId;
    if (!articleId)
      return res
        .status(401)
        .send({ success: true, message: "الرجاء توفير معرف المقالة" });
    await Article.deleteOne({ _id: articleId });
    res.status(201).send({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (err) {
    console.log(err);
  }
};
// COMMENTS FUNCTIONALITY
// add, delete, like, reply.

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
