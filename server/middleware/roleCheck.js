// middleware/roleCheck.js

export const isAdmin = (req, res, next) => {
    // 1. Check if req.user exists (Must be placed AFTER auth middleware in routes)
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    // 2. Allows both 'admin' and 'superadmin'
    const authorizedRoles = ['admin', 'superadmin'];
    
    if (authorizedRoles.includes(req.user.role)) {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            error: 'Access denied: Admin privileges required.' 
        });
    }
};

export const isSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    // Strictly only for 'superadmin'
    if (req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            error: 'Access denied: Super Admin privileges required.' 
        });
    }
};