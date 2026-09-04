import User from '../models/User.js';

// 1. Email Credentials Check
export const checkEmailCredentials = (req, res, next) => {
    const emailUser = process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.NODEMAILER_PASS;
    
    if (!emailUser || !emailPass) {
        return res.status(500).json({ 
            success: false, 
            error: 'Email service credentials missing' 
        });
    }
    next();
};

// 2. Restriction Check (Verification Status)
// FIXED: Using findById to ensure it matches the token payload accurately
export const restrictUnverifiedUsers = async (req, res, next) => {
    try {
        // Retrieve ID from the auth middleware payload
        const idToLookup = req.user?.id || req.user?._id;

        if (!idToLookup) {
            return res.status(401).json({ success: false, error: "Authentication ID missing" });
        }

        const user = await User.findById(idToLookup);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Only allow if approved or admin
        if (user.govIdStatus === 'approved' || user.isAdmin === true) {
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            error: `Action restricted: Your status is ${user.govIdStatus || 'unverified'}` 
        });
        
    } catch (err) { 
        console.error("restrictUnverifiedUsers Error:", err.message);
        res.status(500).json({ success: false, error: 'Server authorization error' }); 
    }
};