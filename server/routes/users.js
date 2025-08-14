const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { profilePicUpload, govIdUpload } = require('../middleware/upload'); // ✅ correct import
const User = require('../models/User');

// get dashboard (condensed)
router.get('/dashboard', auth, async (req, res) => {
  const user = await User.findById(req.user.userId)
    .select('-password')
    .populate('friends', 'userId10 username fullName profilePicture');
  res.json({ success: true, user });
});

// update profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const allowed = ['username', 'profilePicture', 'location', 'address', 'phone', 'fullName'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];

    if (updates.username) {
      const exists = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user.userId }
      });
      if (exists) return res.status(400).json({ success: false, error: 'Username taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// upload profile pic
router.post('/upload-profile-pic', auth, profilePicUpload.single('profilePic'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file' });

  const fileUrl = `/uploads/profilePics/${req.file.filename}`; // ✅ correct subfolder
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { $set: { profilePicture: fileUrl } },
    { new: true }
  ).select('-password');

  res.json({ success: true, profilePicture: fileUrl, user });
});

// upload both sides of government ID
router.post(
  '/upload-gov-id',
  auth,
  govIdUpload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 }
  ]),
  async (req, res) => {
    if (!req.files || (!req.files.govIdFront && !req.files.govIdBack)) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const user = await User.findById(req.user.userId);

    if (req.files.govIdFront) {
      user.govIdFront = `/uploads/govIds/${req.files.govIdFront[0].filename}`; // ✅ correct subfolder
    }

    if (req.files.govIdBack) {
      user.govIdBack = `/uploads/govIds/${req.files.govIdBack[0].filename}`;
    }

    user.govIdStatus = 'pending';
    user.verified = false;

    await user.save();

    res.json({
      success: true,
      message: 'Gov ID front & back uploaded. Pending verification',
      govnmentIdFront: user.govIdFront,
      govIdBack: user.govIdBack
    });
  }
);

module.exports = router;