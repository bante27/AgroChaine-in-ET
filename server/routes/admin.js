const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const User = require('../models/User');

router.get('/verifications/pending', auth, adminOnly, async (req,res) => {
  const pending = await User.find({ 'governmentId.status': 'pending' }).select('userId10 fullName email governmentId');
  res.json({ success:true, pending });
});

router.patch('/verify/:userId', auth, adminOnly, async (req,res) => {
  const { action } = req.body; // 'approve' or 'reject'
  if (!['approve','reject'].includes(action)) return res.status(400).json({ success:false, error:'action must be approve or reject' });
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ success:false, error:'User not found' });
  if (action === 'approve') {
    user.governmentId.status = 'verified';
    user.governmentId.verifiedAt = new Date();
    user.isVerified = true;
  } else {
    user.governmentId.status = 'rejected';
    user.governmentId.verifiedAt = null;
    user.isVerified = false;
  }
  await user.save();
  res.json({ success:true, user });
});

module.exports = router;
