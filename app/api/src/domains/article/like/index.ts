import { Router } from "express";
const router = Router();
import {
    getLikes,
    getLikesCount,
    likeArticle,
    likeAnalysis,
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
router.patch("/:id",
    isLoggedIn(true),
    isConfirmed(true),
    contentAccess({
        contentType: "add-like",
        dataHolder: "params",
        contentIdField: "id",
        queryField: "_id"
    }),
    likeArticle,
);
router.get("/analysis/:articleId",isLoggedIn(true), likeAnalysis)
export default router