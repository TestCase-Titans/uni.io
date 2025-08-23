import db from "../config/db.js";

export const getAllUsers = (req, res) => {
  const query =
    "SELECT id, name, username, email, isBanned, isSysAdmin, isVerified, clubAdminStatus FROM users";

  db.query(query, (err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching users", error: err });
    }
    res.json(users);
  });
};
