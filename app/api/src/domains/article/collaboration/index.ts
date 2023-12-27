import { Router } from "express";
import { isConfirmed, isLoggedIn } from "../../../middleware/auth";
import { addCollaboration, cancleCollaboration, acceptCollaboration, denyCollaboration } from "./controller";
import userDataAccess from "../../../middleware/userDataAccess";
const router = Router();
router.use(
    isLoggedIn(true),
    isConfirmed(true))
router.patch(
    "/request",
    userDataAccess({
        dataHolder: "body",
        requestedUserInfoField: "collaboratorId",
        queryField: "_id"
    }),
    addCollaboration
)
router.patch(
    "/cancle",
    cancleCollaboration
)
router.patch(
    "/accept",
    acceptCollaboration,
);
router.patch("/deny", denyCollaboration);
export default router;