import express from "express";
import { handleContactForm } from "../controllers/contactController.js";
import { contactUpload } from "../middleware/upload.js";

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form with optional files and voice attachment
 * @access  Public
 */
router.post("/", contactUpload, handleContactForm);

export default router;
