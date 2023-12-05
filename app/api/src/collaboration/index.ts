import { Router } from "express";
import { isLoggedIn } from "../middleware/auth";
import { addCollaboration, cancleCollaboration,acceptCollaboration, denyCollaboration } from "./controller";
const router = Router();

router.patch("/request", isLoggedIn(true),addCollaboration)
router.patch("/cancle", isLoggedIn(true),cancleCollaboration)
router.patch("/accept", isLoggedIn(true),acceptCollaboration)
router.patch("/deny", isLoggedIn(true),denyCollaboration);
export default router;