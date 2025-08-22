import express from "express";
import { handleContactForm } from "../controllers/contactController.js";
import { contactUpload } from "../middleware/upload.js";

const router = express.Router();

// Route: POST /api/chat
router.post("/", contactUpload, handleContactForm);

// 👇 This makes it a default export, so you can import it in server.js
export default router;
