import db from "../config/db.js";
import { deleteEvent as eventDelete } from "./eventController.js";

export const banUser = (req, res) => {
  const { id } = req.params;

  const checkQuery = "SELECT isSysAdmin FROM users WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    if (results[0].isSysAdmin) {
      return res.status(403).json({ message: "Cannot ban another sysAdmin" });
    }

    const updateQuery = "UPDATE users SET isBanned = 1 WHERE id = ?";
    db.query(updateQuery, [id], (err2) => {
      if (err2) return res.status(500).json({ message: "Error banning user" });
      res.json({ message: "User banned successfully" });
    });
  });
};

export const approveClubAdmin = (req, res) => {
  const { id } = req.params;

  const query = "UPDATE users SET clubAdminStatus = 'accepted' WHERE id = ? AND clubAdminStatus = 'pending'";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No pending request for this user" });
    }
    res.json({ message: "Club admin request approved" });
  });
};

export const addSysAdmin = (req, res) => {
  const { id } = req.params;

  const query = "UPDATE users SET isSysAdmin = 1 WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User promoted to sysAdmin successfully" });
  });
};


export const deleteEvent = async (req, res) => {
  console.log(`SysAdmin ${req.user.id} deleted event ${req.params.eventId}`);
  return eventDelete(req, res);
};
