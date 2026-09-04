import User from "../models/User.js";

const isNotRestricted = async (req, res, next) => {
    try {
        // We use the ID that your 'auth' middleware extracted from the JWT token
        const idToLookup = req.user?.id || req.user?._id || req.id;

        if (!idToLookup) {
            return res.status(401).json({ success: false, message: "No user ID found in token" });
        }

        const user = await User.findById(idToLookup);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in database" });
        }

        // Your DB shows isRestricted: false, so this check will pass
        if (user.isRestricted === true) {
            return res.status(403).json({ success: false, message: "Account restricted" });
        }

        next();
    } catch (error) {
        console.error("Restriction Middleware Error:", error);
        res.status(500).json({ success: false, message: "Server error checking status" });
    }
};

export default isNotRestricted;