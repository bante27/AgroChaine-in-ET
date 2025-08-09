const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // contains userId, fullName, etc
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

module.exports = auth;
