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
  router.patch("/add/:articleId", isLoggedIn(true), isConfirmed(true), addComment);
  router.patch("/add/reply/:commentId", isLoggedIn(true), isConfirmed(true), addReply);
  router.patch("/like/:commentId", isLoggedIn(true), isConfirmed(true), likeComment);
  router.patch("/delete/:commentId", isLoggedIn(true), deleteComment);
  router.patch("/delete/reply/commentId", isLoggedIn(true), deleteReply);
  
  export default router;
  