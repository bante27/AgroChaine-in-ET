const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success:false, error:'No token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.userId) return res.status(401).json({ success:false, error:'Invalid token' });
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ success:false, error:'User not found' });
    req.user = { userId: user._id, isAdmin: user.isAdmin };
    req.currentUser = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success:false, error:'Auth failed' });
  }
};