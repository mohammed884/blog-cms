import { Router } from "express";
const router = Router();
import {
    getLikes,
    getLikesCount,
    likeArticle,

} from "./controller";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import contentAccess from "../../../middleware/contentAccess";
router.get("/:articleId",
    contentAccess({
        contentType: "get-likes",
        dataHolder: "params",
        contentIdField: "articleId",
        queryField: "_id"
    }),
    getLikes
);
router.get("/count/:articleId", getLikesCount);
router.patch("/article/:id",
    isLoggedIn(true),
    isConfirmed(true),
    contentAccess({
        contentType: "add-like",
        dataHolder: "params",
        contentIdField: "articleId",
        queryField: "_id"
    }),
    likeArticle,
);
export default router