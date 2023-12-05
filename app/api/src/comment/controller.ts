import { Response } from "express";
import Article from "../article/models/article";
import Comment from "./model";
import { deleteNotification, sendNotification } from "../notification/controller";
import { IRequestWithUser } from "../interfaces/global";
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
    //using the comment var we will assign the comments array
    let comments;
    const updateCommentBucket = await Comment.findOneAndUpdate(
      {
        article: articleId,
        commentsCount: {
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
      },
      {
        returnOriginal: false,
      }
    ).lean();
    if (updateCommentBucket) {
      article.commentsCount++;
      await article.save();
      comments = updateCommentBucket.comments;
    } else {
      const commentBucket = await Comment.create({
        article: articleId,
        comments: [
          {
            text,
            author: user._id,
            replies: [],
            likes: [],
            createdAt: new Date(),
          },
        ],
        commentsCount: 1,
      });
      article.commentsCount++;
      await article.save();
      comments = commentBucket.comments;
    };
    console.log(comments);

    const notificationStatus = await sendNotification({
      receiver: article.publisher,
      sender: user._id,
      article: articleId,
      type: "comment",
      retrieveId: comments[comments.length - 1]._id,
    });
    if (!notificationStatus.success) {
      return res.status(401).send({ success: false, message: notificationStatus.err });
    }
    res.status(201).send({ success: true, message: "تم اضافة التعليق" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
};
const deleteComment = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const { articlePublisher, commentId, articleId } = req.body;
    if (!commentId || !articleId)
      return res.status(401).send({
        success: false,
        message: "يجب توفير معرف التعليق و المقالة",
      });
    const updateStatus = await Comment.updateOne(
      {
        article: articleId,
        "comments.author": user._id,
        "comments._id": commentId,
      },
      {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
        $inc: {
          commentsCount: -1,
        },
      }
    );
    console.log(updateStatus);

    if (updateStatus.modifiedCount === 0) {
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
    const deleteNotifictionStatus = await deleteNotification({ receiver: articlePublisher, retrieveId: commentId })
    if (deleteNotifictionStatus.success === false) {
      return res.status(401).send({ success: false, message: "حدث خطا ما" });
    };
    res.status(201).send({ success: true, message: "تم حذف التعليق" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "حدث خطا ما" });
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
        .send({ success: false, message: "تم اضافة الاعجاب الى التعليق" });
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
          .send({ success: true, message: "تم ازالة الاعجاب من التعليق" });
      } else {
        res
          .status(401)
          .send({ success: false, message: "لم يتم العثور على التعليق" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
const addReply = async (req: IRequestWithUser, res: Response) => {
  try {
    //also add notifiction to the user that got the reply 
    //reciver = comment owner
    const user = req.user;
    const { commentAuthor, commentId, articleId } = req.body
    const text = req.body.text;

    if (!text || !commentId || !articleId || !commentAuthor)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء كتابة رد اولا" });
    const updateStatus = await Comment.findOneAndUpdate(
      {
        articleId: articleId,
        "comments._id": commentId,
      },
      {
        $push: {
          "comments.$.replies": {
            author: user._id,
            text,
            createdAt: new Date(),
          },
        },
      }).lean();
    //et the comment from the bucket then get the fucking replies list 
    if (!updateStatus)
      return res.status(401).send({ success: false, message: "حدث خطا ما" });

    const replies = updateStatus.comments.find(comment => comment._id == commentId).replies;
    console.log(replies);

    const notificationStatus = await sendNotification({
      receiver: commentAuthor,
      sender: user._id,
      article: articleId,
      retrieveId: String(replies[replies.length - 1]._id),
      type: "reply"
    });
    console.log(notificationStatus);

    if (!notificationStatus.success) {
      return res.status(401).send({ success: false, message: notificationStatus.message });
    }
    res.status(201).send({ success: true, message: "تم اضافة الرد" });
  } catch (err) {
    console.log(err);
  }
};
const deleteReply = async (req: IRequestWithUser, res: Response) => {
  try {
    const user = req.user;
    const { commentAuthor, replyId } = req.body;
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
    const deletionStatus = await deleteNotification({ receiver: commentAuthor, retrieveId: replyId });
    if (!deletionStatus.success) {
      return res.status(401).send({ success: false, message: deletionStatus.err })
    }
    res.status(201).send({ success: true, message: "تم حذف الرد" });
  } catch (err) {
    console.log(err);
  }
};
export { addComment, deleteComment, likeComment, deleteReply, addReply };
