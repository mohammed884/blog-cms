import {Router} from "express";
import authController from "../controllers/auth";
import authMiddleware from "../middleware/auth";
const router = Router();
router.post("/register", authMiddleware.isLoggedIn(false), authController.register);
router.post("/login", authMiddleware.isLoggedIn(false), authController.login);
router.post("/send/verify-email", authMiddleware.isLoggedIn(true), authMiddleware.isConfirmed(false), authController.sendVerifyEmail);
router.get("/verify/account", authMiddleware.isLoggedIn(true), authMiddleware.isConfirmed(false), authController.verifyAccount)
export default router;
