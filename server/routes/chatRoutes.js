
import express from "express";
import { chatBotResponse } from "../controllers/chatController.js";

const router = express.Router();
router.post("/", chatBotResponse);
export default router;
