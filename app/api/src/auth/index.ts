import { Router } from "express";
import {
  register,
  login,
  verifyAccount,
  sendVerifyEmail,
} from "./controller";
import { isLoggedIn, isConfirmed } from "../middleware/auth";
const router = Router();
router.post("/register", isLoggedIn(false), register);
router.post("/login", isLoggedIn(false), login);
router.post(
  "/confirm/send-email",
  isLoggedIn(true),
  isConfirmed(false),
  sendVerifyEmail
);
router.get(
  "/confirm/email/:token",
  isLoggedIn(true),
  isConfirmed(false),
  verifyAccount
);
export default router;
