import { Router } from "express";
const router = Router();
import {
    getLikes,
    getLikesCount,
    likeArticle,

} from "./controller";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import { isBlocked } from "../../../middleware/user";
router.get("/:articleId", getLikes);
router.get("/count/:articleId", getLikesCount);
router.patch("/like/:id",
    isLoggedIn(true),
    isConfirmed(true),
    isBlocked({ dataHolder: "body", requestedUserInfoField: "articlePublisher", queryField: "_id" }),
    likeArticle,
);
export default router