import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  verifyEmail,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

router.get("/status", isAuthenticated, (req, res) => {
  // req.user is populated by Passport if the session is valid
  const userResponse = { ...req.user };
  delete userResponse.password; // dont send password hash
  console.log("user auth;");
  res.json({ user: userResponse });
});

router.get("/verify-email", verifyEmail);
export default router;
