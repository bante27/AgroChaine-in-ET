// routes/chatRoutes.js
import express from "express";
import { chatBotResponse } from "../controllers/chatController.js";

const router = express.Router();

// POST /api/chat
router.post("/", chatBotResponse);

// Default export so server.js can import it
export default router;
