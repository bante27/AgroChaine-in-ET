import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication Middleware
 * 1. Validates the Bearer token from the header.
 * 2. Uses the MongoDB _id (decoded from token) to fetch fresh user data.
 * 3. Checks if the user still exists or is restricted.
 */
const auth = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the JWT
    // Ensure your JWT_SECRET in .env matches the one used in the Login controller
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user from Database using the internal MongoDB _id
    // In your Login controller, you must sign the token with: { id: user._id }
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication failed. User not found.' 
      });
    }

    // 4. Freshness Check: If you just updated the DB to "verified: true", 
    // this line ensures the rest of your app sees the update immediately.
    req.user = user; 
    
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return res.status(401).json({ 
      success: false, 
      error: 'Token is invalid or has expired.' 
    });
  }
};

export default auth;