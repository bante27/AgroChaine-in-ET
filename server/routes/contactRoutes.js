import express from "express";
import { handleContactForm } from "../controllers/contactController.js";
import { contactUpload } from "../middleware/upload.js";

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form with optional files and voice attachment
 * @access  Public
 */
router.post("/", (req, res, next) => {
  // Try to upload files, but don't fail if it errors
  contactUpload(req, res, (err) => {
    if (err) {
      // Log the error but continue processing the form
      console.warn('File upload error (continuing without files):', err.message);
      // Don't attach files but still process the contact form
      req.files = null;
    }
    next();
  });
}, handleContactForm);

export default router;
