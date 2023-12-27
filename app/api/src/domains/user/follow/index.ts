import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import userDataAccess from "../../../middleware/userDataAccess"
import { followActions, getFollowers, getFollowersCount, getFollowing, getFollowingCount } from "./controller";
const router = Router();
router.patch("/follow/:userId",
    isLoggedIn(true),
    isConfirmed(true),
    userDataAccess({
        dataHolder: "params",
        requestedUserInfoField: "userId",
        queryField: "_id"
    }),
    followActions,
);
router.get("/followers/:userId",
    userDataAccess({
        dataHolder: "params",
        requestedUserInfoField: "userId",
        queryField: "_id"
    }),
    getFollowers
)
router.get("/following/:userId",
userDataAccess({
    dataHolder: "params",
    requestedUserInfoField: "userId",
    queryField: "_id"
}),
    getFollowing
)
router.get("/count/followers/:userId",
    getFollowersCount
)
router.get("/count/following/:userId",
    getFollowingCount
);
export default router;
