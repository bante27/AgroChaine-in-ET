import express from 'express';
import { handleContactForm } from '../controllers/contactController.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { contactSchema } from '../validation/contactValidation.js';

const router = express.Router();

router.post('/', upload.fields([{ name: 'files', maxCount: 5 }, { name: 'voice', maxCount: 1 }]), validate(contactSchema), handleContactForm);

export default router;
