import {
    addArticle,
    getArticle,
    getFeed,
    editArticle,
    deleteArticle,
    saveArticle,
    searchArticles,
    getPublisherArticles,
} from "./controller";
import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../middleware/auth";
import { isOwner } from "../../middleware/article";
import { isBlocked } from "../../middleware/user";
const router = Router();
//articles functionality 
router.get("/feed", isLoggedIn("_", true), getFeed);
router.get("/search", searchArticles);
router.get("/publisher/:publisherId",
    isBlocked({ dataHolder: "params", requestedUserInfoField: "publisherId", queryField: "_id" }),
    getPublisherArticles,
);
router.get("/:id", getArticle);
router.post("/add",
    isLoggedIn(true),
    isConfirmed(true),
    addArticle
);
router.patch("/edit/:id",
    isLoggedIn(true),
    isOwner(true),
    editArticle
);
router.delete("/delete/:id",
    isLoggedIn(true),
    isConfirmed(true),
    deleteArticle
);
router.patch("/save/:id",
    isLoggedIn(true),
    isConfirmed(true),
    isBlocked({ dataHolder: "body", requestedUserInfoField: "articlePublisher", queryField: "_id" }),
    saveArticle
);

export default router;