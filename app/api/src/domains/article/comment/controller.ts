import { Request, Response } from "express";
import Article from "../models/article";
import Comment from "./model";
import { deleteNotification, sendNotification } from "../../notification/controller";
import pagination from "../../../helpers/pagination";
import { getDateYMD, formatDateToYMD } from "../../../helpers/date";
const getComments = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.articleId;
    const page = Number(req.query.page) || 1;
    const matchQuery = { article: articleId };
    const result = await pagination({
      matchQuery,
      page,
      limit: 2,
      Model: Comment,
    });
    //count total comments
    res.status(201).send({ success: true, comments: result.data });
  } catch (err) {
    console.log(err);
  }
};
const getCommentsCount = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.articleId;
    const count = await Comment.countDocuments({ article: articleId });
    res.status(201).send({ success: true, count, });
  } catch (err) {
    console.log(err);
  }
};
const addComment = async (req: Request, res: Response) => {
  try {
    //send notifiction to the user about the comment
    const articleId = req.params.articleId;
    const user = req.user;
    const { text } = req.body;
    const articlePublisherId = req.articlePublisherId;
    if (!text || !articleId)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء مراعاة المعطيات" });

    //using the comment var we will assign the comments array
    let comments;
    const updateCommentBucket = await Comment.findOneAndUpdate(
      {
        article: articleId,
        commentsCount: {
          $lt: 5,
        },
      },
      {
        $push: {
          comments: {
            text,
            author: user._id,
            replies: [],
            likes: [],
            createdAt: formatDateToYMD(new Date(), "_"),
          },
        },
        $inc: {
          commentsCount: 1,
        },
      },
      {
        new: true,
      }
    ).lean();
    if (updateCommentBucket) {
      comments = updateCommentBucket.comments;
      //update the article comments count
      await Article.updateOne({ _id: articleId }, {
        $inc: {
          commentsCount: 1
        }
      })
    } else {
      const article = await Article.findById(articleId).select("publisher");
      if (!article) {
        return res.status(401).send({ success: false, message: "Article not found" })
      };
      const commentBucket = await Comment.create({
        article: articleId,
        articlePublisher: article.publisher,
        comments: [
          {
            text,
            author: user._id,
            replies: [],
            likes: [],
            createdAt: formatDateToYMD(new Date(), "_"),
          },
        ],
        commentsCount: 1,
        createdAt: formatDateToYMD(new Date(), "_"),
      });
      comments = commentBucket.comments;
      //update the article comments count
      await Article.updateOne({ _id: articleId }, {
        $inc: {
          commentsCount: 1
        }
      })
    };
    const notificationStatus = await sendNotification({
      receiver: articlePublisherId,
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
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const commentId = req.params.commentId;
    const { articlePublisher, articleId } = req.body;
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
const likeComment = async (req: Request, res: Response) => {
  try {
    /*
        first create an update statement that expext no user  
        then if there is user create an update request with a query that expect the user 
        dosen't exist return response
    */
    const commentId = req.params.commentId;
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
const addReply = async (req: Request, res: Response) => {
  try {
    //also add notifiction to the user that got the reply 
    //reciver = comment owner
    const user = req.user;
    const articleId = req.params.articleId
    const commentAuthorId = req.commentAuthorId
    const { commentId, text } = req.body
    if (!text)
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
            createdAt: formatDateToYMD(new Date(), "_"),
          },
        },
      }, { new: true }).lean();
    //et the comment from the bucket then get the fucking replies list 
    if (!updateStatus)
      return res.status(401).send({ success: false, message: "حدث خطا ما" });
    const replies = updateStatus.comments.find(comment => comment._id == commentId).replies;
    const notificationStatus = await sendNotification({
      receiver: commentAuthorId,
      sender: user._id,
      article: articleId,
      retrieveId: String(replies[replies.length - 1]._id),
      type: "reply"
    });
    if (!notificationStatus.success) {
      return res.status(401).send({ success: false, message: notificationStatus.err });
    }
    res.status(201).send({ success: true, message: "تم اضافة الرد" });
  } catch (err) {
    console.log(err);
  }
};
const deleteReply = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const replyId = req.params.replyId;
    const { commentAuthor } = req.body;
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
const commentsAnalysis = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const articleId = req.params.articleId;
    if (!articleId) {
      return res.status(401).send({ success: false, message: "Please Provide the article id" });
    }
    const date = new Date(String(req.query.date));
    if (!date) {
      return res.status(401).send({ success: false, message: "Please Provide the date" });
    }
    const { year, month } = getDateYMD(new Date(date));
    const monthLength = new Date(year, month + 1, 0).getDate();
    const dateList = formatDateToYMD(date, [1, 15, monthLength], "DATE");
    //i need to unwind the data to get the comments count      
    const pipeline = [
      {
        $match: {
          articlePublisher: String(user._id),
          article: articleId,
          createdAt: {
            $gte: dateList[0],
            $lte: dateList[2],
          }
        }
      },
      { $unwind: "$comments" },
      {
        $facet: {
          start: [
            {
              $match: {
                "comments.createdAt": dateList[0]
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
                "comments.createdAt": {
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
                "comments.createdAt": {
                  $gt: dateList[1],
                  $lte: dateList[2]
                }
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
    const data = await Comment.aggregate(pipeline);
    res.status(201).send({ success: true, data });
  } catch (err) {
    console.log(err);
  };
}
export {
  getComments,
  getCommentsCount,
  addComment,
  deleteComment,
  likeComment,
  deleteReply,
  addReply,
  commentsAnalysis,
};
