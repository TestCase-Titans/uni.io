import { Router } from "express";
import passport from "passport";
import { register, login, logout } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);

//                          middleware
router.post("/login", passport.authenticate("local"), login);

router.get("/logout", logout);

export default router;
