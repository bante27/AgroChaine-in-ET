const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Use multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Promisify cloudinary upload_stream so we can await it
cloudinary.uploader.upload_stream_async = function(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return reject(error);
      }
      resolve(result);
    });
    stream.end(buffer);
  });
};

// POST /api/verify
router.post('/verify', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received verify request');

    const fullName = req.body.fullName;
    console.log('Full Name:', fullName);

    if (!fullName) {
      console.log('Full name missing');
      return res.status(400).json({ error: 'Full name is required' });
    }

    // Multer files object
    console.log('Files received:', req.files);

    const frontFile = req.files['front'] ? req.files['front'][0] : null;
    const backFile = req.files['back'] ? req.files['back'][0] : null;

    if (!frontFile || !backFile) {
      console.log('One or both images missing');
      return res.status(400).json({ error: 'Both front and back images are required' });
    }

    // Upload front image
    console.log('Uploading front image to Cloudinary');
    const frontUpload = await cloudinary.uploader.upload_stream_async(frontFile.buffer, { folder: 'verifications' });
    console.log('Front image uploaded:', frontUpload.secure_url);

    // Upload back image
    console.log('Uploading back image to Cloudinary');
    const backUpload = await cloudinary.uploader.upload_stream_async(backFile.buffer, { folder: 'verifications' });
    console.log('Back image uploaded:', backUpload.secure_url);

    // Send response
    res.json({
      message: 'Verification files uploaded successfully',
      fullName,
      frontImageUrl: frontUpload.secure_url,
      backImageUrl: backUpload.secure_url,
    });

  } catch (error) {
    console.error('Error in verification route:', error);
    // Return full error message for debugging
    res.status(500).json({ error: error.message || 'Server error during verification' });
  }
});

module.exports = router;
