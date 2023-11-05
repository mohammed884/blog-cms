import {
    addArticle,
    getArticle,
    getArticles,
    editArticle,
    deleteArticle,
    likeArticle,
    saveArticle,
} from "../controllers/article";
import {Router} from "express";
import {isLoggedIn, isConfirmed} from "../middleware/auth";
import {isOwner} from "../middleware/article";
const router = Router();
//articles functionality 
router.get("/", getArticles);
router.get("/:id", getArticle);
router.post("/add", isLoggedIn(true), isConfirmed(true), addArticle);
router.patch("/edit", isLoggedIn(true), isConfirmed(true), isOwner(true), editArticle);
router.patch("/like", isLoggedIn(true), isConfirmed(true), likeArticle);
router.patch("/save", isLoggedIn(true), isConfirmed(true), saveArticle);
router.delete("/delete", isLoggedIn(true), isConfirmed(true), isOwner(true), deleteArticle);

export default router;