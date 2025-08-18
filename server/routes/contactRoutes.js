import express from "express";
import { handleContactForm } from "../controllers/contactController.js";
import { contactUpload } from "../middleware/upload.js";

const router = express.Router();

// Use contactUpload for files + voice
router.post("/", contactUpload, handleContactForm);

export default router;
