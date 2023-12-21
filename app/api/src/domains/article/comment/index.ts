import {
  addComment,
  deleteComment,
  likeComment,
  addReply,
  deleteReply,
  getComments,
} from "./controller";
import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import { isBlocked } from "../../../middleware/user";
const router = Router();
// router.use(isBlocked);
router.get("/:articleId", getComments);
router.patch("/add/:articleId",
  isLoggedIn(true),
  isConfirmed(true),
  isBlocked({
    dataHolder: "body",
    requestedUserInfoField: "articlePublisher",
    queryField: "_id"
  }),
  addComment
);
router.patch("/add/reply/:commentId",
  isLoggedIn(true),
  isConfirmed(true),
  isBlocked({ dataHolder: "body", requestedUserInfoField: "replyAuthor", queryField: "_id" }),
  addReply,
);
router.patch("/like/:commentId",
  isLoggedIn(true),
  isConfirmed(true),
  isBlocked({ dataHolder: "body", requestedUserInfoField: "commentAuthor", queryField: "_id" }),
  likeComment
);
router.patch("/delete/:commentId",
  isLoggedIn(true),
  deleteComment
);
router.patch("/delete/reply/commentId",
  isLoggedIn(true),
  isBlocked({ dataHolder: "body", requestedUserInfoField: "replyAuthor", queryField: "_id" }),
  deleteReply
);

export default router;
