import {
    addComment,
    deleteComment,
    likeComment,
    addReply,
    deleteReply,
  } from "./controller";
  import { Router } from "express";
  import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
  const router = Router();
  router.patch("/add", isLoggedIn(true), isConfirmed(true), addComment);
  router.patch("/add/reply", isLoggedIn(true), isConfirmed(true), addReply);
  router.patch("/like", isLoggedIn(true), isConfirmed(true), likeComment);
  router.patch("/delete", isLoggedIn(true), deleteComment);
  router.patch("/delete/reply", isLoggedIn(true), deleteReply);
  
  export default router;
  