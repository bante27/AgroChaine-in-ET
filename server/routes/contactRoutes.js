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
  contactUpload(req, res, (err) => {
    if (err) {
      // Multer / Cloudinary errors
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, handleContactForm);

export default router;
