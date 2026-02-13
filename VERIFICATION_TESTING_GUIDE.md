# 📋 Verification System Testing Guide

## How to Check if the System is Working Correctly

### 1️⃣ **Test Email OTP Delivery**

#### Step 1: Check Email Configuration
Open your terminal and run:
```bash
cd server
node -e "console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET')"
```

**Expected Result:**
- EMAIL_USER should show your Gmail address
- EMAIL_PASS should show "***SET***"

**If NOT SET:**
1. Open `server/.env`
2. Add these lines:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Step 2: Test OTP Email Sending
1. Log in to your dashboard
2. Click "Verify Account"
3. Complete Step 1 (Name + ID Number + Front/Back photos)
4. Complete Step 2 (Selfie)
5. When you reach Step 3, **check your email inbox**

**Expected Result:**
- You should receive an email titled: "AgroChain - National ID Verification Code"
- The email contains a 6-digit code (e.g., `482951`)
- The code expires in 10 minutes

---

### 2️⃣ **Test OTP Validation**

#### Test Case A: Correct OTP
1. Enter the 6-digit code from your email
2. Click "Confirm OTP"

**Expected Result:**
- ✅ Success message: "Identity Verified! Face match & OTP confirmed via National ID."
- Your account status changes to "Verified"
- Dashboard shows green "Verified" badge

#### Test Case B: Wrong OTP
1. Enter a random 6-digit code (e.g., `111111`)
2. Click "Confirm OTP"

**Expected Result:**
- ⏳ Message: "Identity details saved. OTP check failed (or expired) - pending manual security audit."
- Your account status remains "Pending"
- Admin must manually approve

#### Test Case C: Expired OTP
1. Wait 11 minutes after receiving the email
2. Enter the code from the email
3. Click "Confirm OTP"

**Expected Result:**
- Same as Test Case B (OTP expired, manual review required)

---

### 3️⃣ **Test Resend Code Feature**

1. Reach Step 3 (OTP entry)
2. Click "Resend Code" button
3. Check your email again

**Expected Result:**
- New email with a **different 6-digit code**
- The old code is now invalid
- Only the newest code will work

---

### 4️⃣ **Verify Uploaded Data in Database**

#### Option 1: Using MongoDB Compass (Recommended)
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect using your MongoDB connection string
3. Navigate to: `agrochain` → `users` collection
4. Find your user by email
5. Check these fields:
   - `govIdFront`: Should be a Cloudinary URL (https://res.cloudinary.com/...)
   - `govIdBack`: Should be a Cloudinary URL
   - `govIdSelfie`: Should be a Cloudinary URL
   - `nationalIdNumber`: Your 12-digit ID
   - `govIdStatus`: Either "verified" or "pending"
   - `otp`: Should be `null` after successful verification
   - `otpExpires`: Should be `null` after successful verification

#### Option 2: Using Terminal
```bash
cd server
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User.js').default;
  const user = await User.findOne({ email: 'YOUR_EMAIL@gmail.com' });
  console.log('User Verification Data:');
  console.log('- Name:', user.fullName);
  console.log('- National ID:', user.nationalIdNumber);
  console.log('- Status:', user.govIdStatus);
  console.log('- Front ID URL:', user.govIdFront);
  console.log('- Back ID URL:', user.govIdBack);
  console.log('- Selfie URL:', user.govIdSelfie);
  console.log('- OTP (should be null):', user.otp);
  process.exit(0);
});
"
```

---

### 5️⃣ **Verify Images on Cloudinary**

1. Log in to Cloudinary: https://cloudinary.com/console
2. Go to "Media Library"
3. Navigate to `uploads/govIds/` folder
4. You should see 3 images:
   - Front ID photo
   - Back ID photo
   - Selfie photo

**Check Image Quality:**
- Images should be clear and readable
- File size: 50KB - 500KB (good compression)
- Format: JPEG

---

### 6️⃣ **Test Face Match (Future AI Integration)**

**Current Status:** Simulated (always returns `true`)

**To Enable Real Face Matching:**
1. Sign up for Smile ID: https://www.usesmileid.com/
2. Get your API Key
3. Update `server/routes/userRoutes.js` line 643:
```javascript
// Replace this line:
const isFaceMatch = true; // Simulating successful AI Face Match

// With this:
const faceMatchResult = await axios.post('https://api.smileidentity.com/v1/face_match', {
  selfie: user.govIdSelfie,
  idPhoto: user.govIdFront,
  apiKey: process.env.SMILE_ID_API_KEY
});
const isFaceMatch = faceMatchResult.data.match === true;
```

---

### 7️⃣ **Test National ID Validation (Future Fayda API)**

**Current Status:** Only checks if ID is 10+ digits

**To Enable Real Fayda Validation:**
1. Contact Ethiopian National ID Program: https://nidp.et/
2. Request API access for identity verification
3. Update `server/routes/userRoutes.js` line 636:
```javascript
// Replace this line:
const isIdValid = nationalIdNumber && nationalIdNumber.length >= 10;

// With this:
const faydaResponse = await axios.post('https://api.nidp.et/verify', {
  idNumber: nationalIdNumber,
  apiKey: process.env.FAYDA_API_KEY
});
const isIdValid = faydaResponse.data.valid === true;
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Email service credentials missing"
**Solution:** Add EMAIL_USER and EMAIL_PASS to `server/.env`

### Issue 2: "Failed to send verification code"
**Solution:** 
1. Make sure you're using a Gmail **App Password**, not your regular password
2. Enable 2-Factor Authentication on your Gmail
3. Generate App Password: https://myaccount.google.com/apppasswords

### Issue 3: Images not uploading
**Solution:** Check Cloudinary credentials in `server/.env`:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Issue 4: OTP always fails even with correct code
**Solution:** Check server time synchronization:
```bash
# Windows
w32tm /query /status

# If time is wrong, sync it:
w32tm /resync
```

---

## ✅ Success Checklist

- [ ] Email with OTP code arrives within 30 seconds
- [ ] Correct OTP grants instant verification
- [ ] Wrong OTP sends to manual review
- [ ] Resend Code generates new OTP
- [ ] All 3 images (Front, Back, Selfie) are saved to Cloudinary
- [ ] National ID number is saved to database
- [ ] Dashboard shows "Verified" badge after success
- [ ] UI is responsive on mobile devices
- [ ] All text is properly translated to Amharic

---

## 📱 Mobile Testing

1. Open your deployed site on your phone
2. Test camera permissions (should ask for permission)
3. Test front/back camera switching
4. Test file upload from gallery
5. Verify OTP input works with mobile keyboard
6. Check that all buttons are easily tappable (44px minimum)

---

## 🎯 Performance Benchmarks

- **Step 1 → Step 2:** < 1 second
- **Step 2 → Step 3 (OTP send):** < 5 seconds
- **OTP Verification:** < 2 seconds
- **Total Time (Start to Verified):** < 3 minutes

If any step takes longer, check your internet connection and server logs.
