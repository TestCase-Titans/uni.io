import express from "express";
import cors from "cors";
import { createConnection } from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
  },
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
