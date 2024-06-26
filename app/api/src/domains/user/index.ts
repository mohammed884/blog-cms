import { Router } from "express";
import {
    getUser,
    editProfile,
    searchUser,
    blockUser,
    unBlockUser,
    getBlockedUsers,
    markNotificationAsReaded
} from "./controller";
import { isConfirmed, isLoggedIn } from "../../middleware/auth";
import userDataAccess from "../../middleware/userDataAccess";
import { getNotifications, getUnSeenNotificationsCount } from "../notification/controller";
const router = Router();
//notifications
router.get("/notifications", isLoggedIn(true), getNotifications)
router.get("/notifications/count/unseen", isLoggedIn(true), getUnSeenNotificationsCount)
router.patch("/notifications/mark-as-readed/:retrieveId", isLoggedIn(true), markNotificationAsReaded);
router.get("/blocked", isLoggedIn(true), getBlockedUsers);
router.get("/:username",
    isLoggedIn("_", true),
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "username",
        storeRequestReciver: true
    }),
    getUser,
);
router.get("/search/:username",
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "username"
    }),
    searchUser
);
router.patch("/block/:id",
    isLoggedIn(true),
    isConfirmed(true),
    blockUser,
);
router.patch("/unblock/:id", isLoggedIn(true), unBlockUser)
router.patch("/edit", isLoggedIn(true), editProfile);

export default router;