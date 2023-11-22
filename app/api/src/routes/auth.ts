import { Router } from "express";
import {
  register,
  login,
  verifyAccount,
  sendVerifyEmail,
} from "../controllers/auth";
import { isLoggedIn, isConfirmed } from "../middleware/auth";
const router = Router();
router.post("/register", isLoggedIn(false), register);
router.post("/login", isLoggedIn(false), login);
router.post(
  "/send/verify-email",
  isLoggedIn(true),
  isConfirmed(false),
  sendVerifyEmail
);
router.get(
  "/verify/account",
  isLoggedIn(true),
  isConfirmed(false),
  verifyAccount
);
export default router;
