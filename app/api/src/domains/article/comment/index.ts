import {
  addComment,
  deleteComment,
  likeComment,
  addReply,
  deleteReply,
  getComments,
  commentsAnalysis,
} from "./controller";
import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import contentAccess from "../../../middleware/contentAccess"
const router = Router();
router.get("/:articleId",
  contentAccess({
    contentType: "get-comments",
    dataHolder: "params",
    contentIdField: "articleId",
    queryField: "_id"
  }),
  getComments
);
router.get("/analysis/:articleId", isLoggedIn(true),commentsAnalysis);
router.patch("/add/:articleId",
  isLoggedIn(true),
  isConfirmed(true),
  contentAccess({
    contentType: "add-comment",
    dataHolder: "params",
    contentIdField: "articleId",
    queryField: "_id",
  }),
  addComment
);
router.patch("/add/reply/:commentId",
  isLoggedIn(true),
  isConfirmed(true),
  contentAccess({
    contentType: "add-reply",
    dataHolder: "params",
    contentIdField: "commentId",
    queryField: "_id"
  }),
  addReply,
);
router.patch("/like/:commentId",
  isLoggedIn(true),
  isConfirmed(true),
  contentAccess({
    contentType: "add-comment-like",
    dataHolder: "params",
    contentIdField: "commentId",
    queryField: "_id"
  }),
  likeComment
);
router.patch("/delete/:commentId",
  isLoggedIn(true),
  deleteComment
);
router.patch("/delete/reply/commentId",
  isLoggedIn(true),
  deleteReply
);

export default router;
