import { Router } from "express";
import { isLoggedIn, isConfirmed } from "../../../middleware/auth";
import userDataAccess from "../../../middleware/userDataAccess"
import { followActions, followersAnalysis, getFollowers, getFollowersCount, getFollowing, getFollowingCount } from "./controller";
const router = Router();
router.get("/followers/analysis",
    isLoggedIn(true),
    followersAnalysis
);
router.patch("/follow/:userId",
    isLoggedIn(true),
    isConfirmed(true),
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "userId",
        queryField: "_id"
    }),
    followActions,
);
router.get("/followers/:userId",
    isLoggedIn("_", true),
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "userId",
        queryField: "_id"
    }),
    getFollowers
)
router.get("/following/:userId",
    isLoggedIn("_", true),
    userDataAccess({
        dataHolder: "params",
        requestReciverInfoField: "userId",
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
