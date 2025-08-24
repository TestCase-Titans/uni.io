export const requireRole = (roles) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const roleArray = Array.isArray(roles) ? roles : [roles];

  // Use the role set in deserialization
  if (roleArray.includes(user.role)) return next();

  return res.status(403).json({ message: "Forbidden" });
};
