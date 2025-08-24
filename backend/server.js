import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import MySQLStore from "express-mysql-session";
import db from "./config/db.js";
import configurePassport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sysAdminRoutes from "./routes/sysAdminRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5176",
      "https://uni-io.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
const sessionStore = new (MySQLStore(session))({}, db);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretKey", // Always use a secret from .env
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

if (isProduction) {
  app.set("trust proxy", 1);
}

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/sysadmin", sysAdminRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
