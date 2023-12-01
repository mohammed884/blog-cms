import {
    addArticle,
    getArticle,
    getArticles,
    editArticle,
    deleteArticle,
    likeArticle,
    saveArticle,
    searchArticles,
} from "../controllers/article";
import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../middleware/auth";
import { isOwner } from "../middleware/article";
const router = Router();
//articles functionality 
router.get("/", getArticles);
router.get("/:id", getArticle);
router.get("/search", searchArticles);
router.post("/add", isLoggedIn(true), isConfirmed(true), addArticle);
router.patch("/edit/:id", isLoggedIn(true), isOwner(true), editArticle);
router.delete("/delete/:id", isLoggedIn(true), isConfirmed(true), isOwner(true), deleteArticle);
router.patch("/like/:id", isLoggedIn(true), isConfirmed(true), likeArticle);
router.patch("/save/:id", isLoggedIn(true), isConfirmed(true), saveArticle);

export default router;