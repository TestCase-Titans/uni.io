import { Router } from "express";
import passport from "passport";
import { register, login, logout, verifyEmail } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
//                    middleware
router.post("/login", passport.authenticate("local"), login);
router.get("/logout", logout);
router.get("/verify-email", verifyEmail);
export default router;
