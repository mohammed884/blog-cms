import {
    getFeed,
    getTopArticles,
    getArticle,
    getPublisherArticles,
    addArticle,
    searchArticles,
    saveArticle,
    editArticle,
    deleteArticle,
} from "./controller";
import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../middleware/auth";
import { isOwner } from "../../middleware/article";
import userDataAccess from "../../middleware/userDataAccess";
import contentAccess from "../../middleware/contentAccess";
const router = Router();
//articles functionality 
router.get("/feed", isLoggedIn("_", true), getFeed);
router.get("/search", isLoggedIn(true), searchArticles);
router.get("/publisher/:publisherId",
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "publisherId",
        queryField: "_id"
    }),
    getPublisherArticles,
);
router.get("/top", getTopArticles)
router.get("/:id",
    contentAccess({
        contentType: "get-article",
        dataHolder: "params",
        contentIdField: "id",
        queryField: "_id"
    }),
    getArticle,
);
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
    contentAccess({
        contentType: "save-article",
        dataHolder: "params",
        contentIdField: "id",
        queryField: "_id"
    }),
    saveArticle,
);
export default router;