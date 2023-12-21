import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import { isBlocked } from "../../../middleware/user"
import { followActions, getFollowers, getFollowersCount, getFollowing, getFollowingCount } from "./controller";
const router = Router();
router.patch("/follow/:user",
    isLoggedIn(true),
    isConfirmed(true),
    isBlocked({
        dataHolder: "params",
        requestedUserInfoField: "user",
        queryField: "_id"
    }),
    followActions,
);
router.get("/followers/:userId",
    getFollowers
)
router.get("/following/:userId",
    getFollowing
)
router.get("/count/followers/:userId",
    getFollowersCount
)
router.get("/count/following/:userId",
    getFollowingCount
);
export default router;
