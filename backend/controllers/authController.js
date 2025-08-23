import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import db from "../config/db.js";

export const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    let clubAdminStatus = "never_applied";
    if (role === "ClubAdmin") {
      clubAdminStatus = "pending";
    }

    const userQuery =
      "INSERT INTO users (name, username, email, password, isBanned, isSysAdmin, clubAdminStatus, isVerified, verificationToken) VALUES (?, ?, ?, ?, FALSE, FALSE, ?, FALSE, ?)";

    db.query(
      userQuery,
      [name, username, email, hashedPassword, clubAdminStatus, verificationToken],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const userId = result.insertId;

        if (role === "ClubAdmin") {
          const appQuery =
            "INSERT INTO clubAdminApplications (userId, status, appliedAt, reviewedBy, reviewedAt) VALUES (?, 'pending', NOW(), NULL, NULL)";
          db.query(appQuery, [userId], (err2) => {
            if (err2)
              console.error(
                "Failed to insert into clubAdminApplications:",
                err2.message
              );
          });
        }

        sendVerificationEmail(email, verificationToken);

        res.status(201).json({
          message:
            "User registered. Please check your email to verify your account.",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = (req, res) => {
  if (req.user.isBanned) {
    return res.status(403).json({ message: "Your account is banned." });
  }
  if (!req.user.isVerified) {
    return res.status(403).json({ message: "Please verify your email first." });
  }

  const userResponse = { ...req.user };
  delete userResponse.password;

  res.json({ message: "Logged in successfully", user: userResponse });
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
};

export const verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: "Token is required" });

  db.query(
    "UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE verificationToken = ?",
    [token],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(400).json({ message: "Invalid or expired token" });

      res.json({ message: "Email verified successfully!" });
    }
  );
};

function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const urlPrefix = process.env.URL_PREFIX;
  const verificationLink = `${urlPrefix}/auth/verify-email?token=${token}`;
  console.log(`Verification link: ${verificationLink}`);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Verification email sent:", info.response);
  });
}
