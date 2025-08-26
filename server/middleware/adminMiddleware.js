// middleware/admin.js
import User from "../models/User.js";

export default async function admin(req, res, next) {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: "Access denied: Admin only" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ success: false, error: "Server error in admin middleware" });
  }
}
