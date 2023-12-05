import { Router } from "express";
import { editUser, getUser, searchUser, followUser, blockUser, unBlockUser } from "./controller";
import { isConfirmed, isLoggedIn } from "../../middleware/auth";
const router = Router();
router.get("/:username", getUser)
router.get("/search/:username", searchUser)
router.patch("/block/:id", isLoggedIn(true), isConfirmed(true), blockUser)
router.patch("/unblock/:id", isLoggedIn(true), unBlockUser)
router.patch("/edit", isLoggedIn(true), editUser);
router.patch("/follow/:id", isLoggedIn(true), isConfirmed(true), followUser);
export default router;