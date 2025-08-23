import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (name, username, email, password, isBanned, isSysAdmin) VALUES (?, ?, ?, ?, FALSE, FALSE)";

    db.query(query, [name, username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: "User registered", userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = (req, res) => {
  if (req.user.isBanned) {
    return res.status(403).json({ message: "Your account is banned." });
  }

  const userResponse = { ...req.user };
  delete userResponse.password;

  res.json({ message: "Logged in successfully", user: userResponse });
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
};
