import express from "express";
import cors from "cors";
import { createConnection } from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5176"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
  // },
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

app.get("/users", (req, res) => {
  db.query(
    "SELECT user_id, f_name, l_name, email, phone, address FROM users",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return done(err);
      if (results.length === 0)
        return done(null, false, { message: "No user found" });

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong password" });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE user_id = ?", [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

app.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    db.query(
      "INSERT INTO users (name, username, email, password, isBanned, isSysAdmin) VALUES (?, ?, ?, ?, FALSE, FALSE)",
      [name, username, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User registered", user_id: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user.isBanned) {
    return res.status(403).json({ message: "Your account is banned" });
  }
  res.json({ message: "Logged in", user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logged out" });
  });
});