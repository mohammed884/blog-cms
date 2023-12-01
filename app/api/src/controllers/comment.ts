import { Response } from "express";
import Article from "../models/article";
import Comment from "../models/comment";
import { IRequestWithUser } from "interfaces/global";
const addComment = async (req: IRequestWithUser, res: Response) => {
  try {
    //send notifiction to the user about the comment
    const user = req.user;
    const articleId = req.body.articleId;
    const text = req.body.text;

    if (!text || !articleId)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء كتابة تعليق اولا" });

    const article = await Article.findOne({ _id: articleId });
    if (!article)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على المقالة" });
    const updateStatus = await Comment.updateOne(
      {
        article: articleId,
        count: {
          $lt: 50,
        },
      },
      {
        $push: {
          comments: {
            text,
            author: user._id,
            createdAt: new Date(),
            replies: [],
            likes: [],
          },
        },
        $inc: {
          commentsCount: 1,
        },
      }
    );
    if (updateStatus.modifiedCount === 1) {
      article.commentsCount++;
      await article.save();
      res.status(201).send({ success: true, message: "تم اضافة التعليق" });
    } else {
      await Comment.create({
        article: articleId,
        comments: [
          {
            text,
            author: user._id,
            createdAt: new Date(),
            replies: [],
            likes: [],
          },
        ],
        commentsCount: 1,
        createdAt: new Date(),
      });
      article.commentsCount++;
      await article.save();
      res.status(201).send({ success: true, message: "تم اضافة التعليق" });
    }
  } catch (err) {
    console.log(err);
  }
};
const deleteComment = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const commentId = req.body.commentId;
    const articleId = req.body.articleId;
    if (!commentId || !articleId)
      return res.status(401).send({
        success: false,
        message: "يجب توفير معرف التعليق و المقالة",
      });
    const updateStatus = await Comment.updateOne(
      {
        "comments._id": commentId,
        "comments.author": user._id,
        article: articleId,
      },
      {
        $pull: {
          comments: {
            author: user._id,
          },
        },
        $inc: {
          commentsCount: -1,
        },
      }
    );
    if (updateStatus.modifiedCount !== 1) {
      return res.status(401).send({ success: false, message: "حدث خطا ما" });
    }
    await Article.updateOne(
      { _id: articleId },
      {
        $inc: {
          commentsCount: -1,
        },
      }
    );
    res.status(201).send({ success: true, message: "تم حذف التعليق" });
  } catch (err) {
    console.log(err);
  }
};
const likeComment = async (req: IRequestWithUser, res: Response) => {
  try {
    /*
        first create an update statement that expext no user  
        then if there is user create an update request with a query that expect the user 
        dosen't exist return response
      */
    const commentId = req.body.commentId;
    const user = req.user;
    const updateStatus = await Comment.updateOne(
      {
        "comments._id": commentId,
        "comments.likes._id": { $ne: user._id },
      },
      {
        $push: {
          "comments.$.likes": { _id: user._id },
        },
      }
    );
    if (updateStatus.modifiedCount === 1) {
      res
        .status(201)
        .send({ sucess: false, message: "تم اضافة الاعجاب الى التعليق" });
    } else {
      const updateStatus = await Comment.updateOne(
        {
          "comments._id": commentId,
          "comments.likes._id": user._id,
        },
        {
          $pull: {
            "comments.$.likes": {
              _id: user._id,
            },
          },
        }
      );
      if (updateStatus.modifiedCount === 1) {
        res
          .status(201)
          .send({ sucess: true, message: "تم ازالة الاعجاب من التعليق" });
      } else {
        res
          .status(401)
          .send({ sucess: false, message: "لم يتم العثور على التعليق" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
const addReply = async (req: IRequestWithUser, res: Response) => {
  try {
    //also add notifiction to the user that got the reply 
    const user = req.user;
    const commentId = req.body.commentId;
    const articleId = req.body.articleId;
    const text = req.body.text;

    if (!text)
      return res
        .status(401)
        .send({ sucess: false, message: "الرجاء كتابة رد اولا" });

    const updateStatus = await Comment.updateOne(
      {
        "comments._id": commentId,
        articleId: articleId,
      },
      {
        $push: {
          "comments.$.likes": {
            author: user._id,
            text,
            createdAt: new Date(),
          },
        },
      }
    );
    if (updateStatus.modifiedCount !== 1)
      return res.status(401).send({ sucess: false, message: "حدث خطا ما" });
    res.status(201).send({ sucess: true, message: "تم اضافة الرد" });
  } catch (err) {
    console.log(err);
  }
};
const deleteReply = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const replyId = req.body.replyId;
    const updateStatus = await Comment.updateOne(
      {
        "comments.replies._id": replyId,
        "comments.replies.author": user._id,
      },
      {
        $pull: {
          "comments.$.replies": {
            _id: replyId,
          },
        },
      }
    );
    if (updateStatus.modifiedCount !== 1)
      return res.status(401).send({ success: false, message: "حدث خطا ما" });
    res.status(201).send({ success: true, message: "تم حذف الرد" });
  } catch (err) {
    console.log(err);
  }
};
export { addComment, deleteComment, likeComment, deleteReply, addReply };
