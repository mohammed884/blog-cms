import { Router } from "express";
import { isConfirmed, isLoggedIn } from "../../../middleware/auth";
import { addCollaboration, cancleCollaboration, acceptCollaboration, denyCollaboration } from "./controller";
import { isBlocked } from "../../../middleware/user";
const router = Router();
router.use(
    isLoggedIn(true),
    isConfirmed(true))
router.patch(
    "/request",
    isBlocked({
        dataHolder: "body",
        requestedUserInfoField: "collaboratorId",
        queryField: "_id"
    }),
    addCollaboration
)
router.patch(
    "/cancle",
    isBlocked({
        dataHolder: "body",
        requestedUserInfoField: "collaboratorId",
        queryField: "_id"
    }),
    cancleCollaboration
)
router.patch(
    "/accept",
    acceptCollaboration
);
router.patch("/deny", denyCollaboration);
export default router;