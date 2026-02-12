// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token, authorization denied' });

  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET is not defined in environment variables!');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrochain_secret_fallback_123');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message);
    return res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

export default auth;
