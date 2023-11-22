import { Response, Request } from "express";
import { addArticleSchema } from "../validation/article";
import Article from "../models/article";
import Like from "../models/like";
import { IRequestWithUser } from "interfaces/global";
import { ObjectId } from "mongodb";
import Topic from "../models/topic";
import { uploadSingle } from "helpers/fileupload";
interface IAddPostBody {
  title: string;
  content: object;
  topics: [];
}
/*
  How collbrations are going to work
  first you add the person to the article collbrations list with a pending status
  then if the user that was added accepts he will be allowed to edit.
  we will create a speical route for the accepting function  
*/

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
    const body: IAddPostBody = req.body;
    await addArticleSchema.validateAsync(body);
    // const areTopicsValid = await Topic.find({ _id: { $all: body.topics } });
    // if (!areTopicsValid) return res.status(401).send({ success: false, message: "تاكد من المواضيع المعطاه" })
    
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
const editArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const articleId = req.params.id;
    await Article.updateOne(
      {
        _id: articleId,
      },
      {
        $set: {
          title: body.title,
          content: body.content,
          topics: body.topics,
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
    const articleId = req.params.id;
    const article = await Article.findOne({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });

    const likesBucket = await Like.findOne({ article: articleId, likesCount: { $lt: 50 } });
    const isLikedBefore = likesBucket.likes.find((like) => like.user === user._id)
    switch (true as unknown) {
      case isLikedBefore:
        likesBucket.likes = likesBucket.likes.filter(like => like.user !== user._id);
        likesBucket.likesCount--;
        article.likesCount--;
        await likesBucket.save()
        await article.save();
        res.status(201).send({ success: true, message: "تم ازالة التعليق" });
        break;
      case !isLikedBefore:
        likesBucket.likes = [...likesBucket.likes, { user: user._id, createdAt: new Date() }];
        likesBucket.likesCount++;
        article.likesCount++;
        await likesBucket.save()
        await article.save()
        res.status(201).send({ success: true, message: "تم اضافة التعليق" });
        break;

      case !likesBucket:
        await Like.create({
          likesCount: 1,
          likes: [
            {
              user: user._id,
              createdAt: new Date()
            }
          ],
        })
        article.likesCount++;
        await article.save();
        res.status(201).send({ success: true, message: "تم اضافة التعليق" })
        break;
      default:
        console.log("like request");
    }
    // //if the user didn't like the article before
    // const updateStatus = await Like.updateOne(
    //   {
    //     article: articleId,
    //     "likes.user": { $ne: user._id },
    //     count: {
    //       $lt: 50,
    //     },
    //   },
    //   {
    //     $push: {
    //       likes: {
    //         user: user._id,
    //         createdAt: new Date(),
    //       },
    //     },
    //     $inc: {
    //       likesCount: 1,
    //     },
    //   }
    // );
    // if (updateStatus.modifiedCount === 1) {
    //   article.likesCount++;
    //   await article.save();
    //   res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
    // } else {
    //   //if the user liked the article before
    //   const updateStatus = await Like.updateOne(
    //     {
    //       article: articleId,
    //       "likes.user": user._id,
    //       count: {
    //         $lt: 50,
    //       },
    //     },
    //     {
    //       $pull: {
    //         likes: {
    //           user: user._id,
    //         },
    //       },
    //       $inc: {
    //         likesCount: -1,
    //       },
    //     }
    //   );
    //   if (updateStatus.modifiedCount === 1) {
    //     article.likesCount--;
    //     await article.save();
    //     res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
    //   } else {
    //     //if there is no bucket and the user didn't like the article before
    //     console.log("create a bucket");
    //     await Like.create({
    //       article: articleId,
    //       likes: [
    //         {
    //           user: user._id,
    //           createdAt: new Date(),
    //         },
    //       ],
    //       likesCount: 1,
    //     });
    //     article.likesCount++;
    //     await article.save();
    //     res.status(201).send({ success: true, message: "تم اضافة الاعجاب" });
    //   }
    // }
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
  }
};
const deleteArticle = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    if (!articleId)
      return res
        .status(401)
        .send({ success: true, message: "الرجاء توفير معرف المقالة" });
    const article = await Article.findOne({ id: articleId });
    if (!article) res.status(201).send({ success: false, message: "لا يوجد مقالة بهذا المعرف" });
    if (article.cover)
    await Article.deleteOne({ _id: articleId });
    res.status(201).send({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (err) {
    console.log(err);
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
