import express from "express";
import { handleContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", handleContactForm);

export default router;
