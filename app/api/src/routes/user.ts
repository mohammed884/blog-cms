import { Router } from "express";
import { editUser, getUser, searchUser, followUser } from "../controllers/user";
import { isConfirmed, isLoggedIn } from "../middleware/auth";
const router = Router();

router.get("/search/:username", searchUser)
router.get("/:username", getUser)
router.patch("/edit", isLoggedIn(true), editUser);
router.patch("/follow/:id", isLoggedIn(true), isConfirmed(true), followUser);
export default router;