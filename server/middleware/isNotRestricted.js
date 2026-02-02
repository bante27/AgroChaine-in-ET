import User from "../models/User.js";

const isNotRestricted = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        if (user.isRestricted) {
            return res.status(403).json({
                success: false,
                error: "Your account has been restricted. You cannot perform this action."
            });
        }

        next();
    } catch (error) {
        console.error("Restriction check error:", error);
        res.status(500).json({ success: false, error: "Server error checking user restrictions" });
    }
};

export default isNotRestricted;
