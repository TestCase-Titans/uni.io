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
  const { applicationId } = req.params;

  // 1. Find the application
  const findAppQuery = "SELECT userId, status FROM clubAdminApplications WHERE id = ?";
  db.query(findAppQuery, [applicationId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "Application not found" });

    const application = results[0];
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application is not pending" });
    }

    const userId = application.userId;

    // 2. Update user
    const updateUserQuery = "UPDATE users SET clubAdminStatus = 'accepted' WHERE id = ?";
    db.query(updateUserQuery, [userId], (err2) => {
      if (err2) return res.status(500).json({ message: "DB error updating user" });

      // 3. Update application as reviewed
      const updateAppQuery = "UPDATE clubAdminApplications SET status = 'accepted', reviewedBy = ?, reviewedAt = NOW() WHERE id = ?";
      db.query(updateAppQuery, [req.user.id, applicationId], (err3) => {
        if (err3) return res.status(500).json({ message: "DB error updating application" });

        res.json({ message: "Club admin request approved" });
      });
    });
  });
};


export const addSysAdmin = (req, res) => {
  const { userId } = req.params;
  const id = parseInt(userId, 10); 

  if (!id) return res.status(400).json({ message: "Invalid user id" });

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
