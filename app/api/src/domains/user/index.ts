import { Router } from "express";
import { getProfile, getUser, editUser, searchUser, blockUser, unBlockUser } from "./controller";
import { isConfirmed, isLoggedIn } from "../../middleware/auth";
import userDataAccess from "../../middleware/userDataAccess";
import { getNotifications, getUnSeenNotificationsCount } from "../notification/controller";
const router = Router();
router.get("/profile", isLoggedIn(true), getProfile);
router.get("/notifications", isLoggedIn(true), getNotifications)
router.get("/notifications/count", isLoggedIn(true), getUnSeenNotificationsCount)
router.get("/:username",
    isLoggedIn("_", true),
    userDataAccess({ dataHolder: "params", requestReciverInfoField: "username", storeRequestReciver: true }),
    getUser,
);
router.get("/search/:username",
    userDataAccess({ dataHolder: "params", requestReciverInfoField: "username" }),
    searchUser
);
router.patch("/block/:id",
    isLoggedIn(true),
    isConfirmed(true),
    blockUser,
);
router.patch("/unblock/:id", isLoggedIn(true), unBlockUser)
router.patch("/edit", isLoggedIn(true), editUser);
export default router;