const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

async function generateUnique10DigitId() {
  const getRandom = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
  let id = getRandom();
  for (let i=0;i<5;i++){
    if (!await User.findOne({ userId10: id })) return id;
    id = getRandom();
  }
  return uuidv4().replace(/[^0-9]/g,'').slice(0,10).padEnd(10,'0');
}

router.post('/register', [
  body('fullName').isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('address').notEmpty(),
  body('password').isLength({ min: 8 }),
  body('confirmPassword').custom((v,{req})=>v===req.body.password)
], async (req,res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ success:false, error: err.array()[0].msg });
    const { fullName, email, phone, address, password } = req.body;
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ success:false, error:'Email in use' });
    const hashed = await bcrypt.hash(password, 10);
    const userId10 = await generateUnique10DigitId();
    const u = new User({ userId10, fullName, email: email.toLowerCase(), phone, address, password: hashed });
    await u.save();
    const token = jwt.sign({ userId: u._id }, process.env.JWT_SECRET, { expiresIn:'7d' });
    res.status(201).json({ success:true, token, user: { userId: u.userId10, fullName: u.fullName, email: u.email }});
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

router.post('/login', [
  body('email').isEmail(), body('password').notEmpty()
], async (req,res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ success:false, error: err.array()[0].msg });
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success:false, error:'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success:false, error:'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn:'7d' });
    res.json({ success:true, token, user: {  userId: user.userId10, fullName: user.fullName, email: user.email }});
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

module.exports = router;
