import { Router } from "express";
import { editUser, getUser, searchUser, followUser, blockUser, unBlockUser } from "./controller";
import { isConfirmed, isLoggedIn } from "../../middleware/auth";
import { isBlocked } from "../../middleware/user";
const router = Router();
router.get("/:username",
    isBlocked({ dataHolder: "params", requestedUserInfoField: "username" }),
    getUser
);
router.get("/search/:username",
    isBlocked({ dataHolder: "params", requestedUserInfoField: "username" }),
    searchUser
);
router.patch("/block/:id",
    isLoggedIn(true),
    isConfirmed(true),
    blockUser
)
router.patch("/unblock/:id", isLoggedIn(true), isConfirmed(true), unBlockUser)
router.patch("/edit", isLoggedIn(true), editUser);
router.patch("/follow/:user", isLoggedIn(true), isConfirmed(true), isBlocked({ dataHolder: "params", requestedUserInfoField: "user", queryField: "_id" }), followUser);
export default router;