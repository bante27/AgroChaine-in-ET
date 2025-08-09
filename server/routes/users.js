const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../models/User');

// get dashboard (condensed)
router.get('/dashboard', auth, async (req,res) => {
  const user = await User.findById(req.user.userId).select('-password').populate('friends','userId10 username fullName profilePicture');
  res.json({ success:true, user });
});

// update profile
router.patch('/profile', auth, async (req,res) => {
  try {
    const allowed = ['username','profilePicture','location','address','phone','fullName'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
    if (updates.username) {
      const exists = await User.findOne({ username: updates.username, _id: { $ne: req.user.userId } });
      if (exists) return res.status(400).json({ success:false, error:'Username taken' });
    }
    const user = await User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true }).select('-password');
    res.json({ success:true, user });
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

// upload profile pic
router.post('/upload-profile-pic', auth, upload.single('profilePic'), async (req,res) => {
  if (!req.file) return res.status(400).json({ success:false, error:'No file' });
  const fileUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user.userId, { $set: { profilePicture: fileUrl } }, { new: true }).select('-password');
  res.json({ success:true, profilePicture: fileUrl, user });
});

// upload government ID
router.post('/upload-gov-id', auth, upload.single('govId'), async (req,res) => {
  if (!req.file) return res.status(400).json({ success:false, error:'No file' });
  const fileUrl = `/uploads/${req.file.filename}`;
  const user = await User.findById(req.user.userId);
  user.governmentId = { fileUrl, status: 'pending', verifiedAt: null };
  user.isVerified = false;
  await user.save();
  res.json({ success:true, message:'Gov ID uploaded. Pending verification', governmentId: user.governmentId });
});

module.exports = router;
