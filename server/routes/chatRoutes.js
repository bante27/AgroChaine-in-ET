import express from 'express';
import { chatBotResponse } from '../controllers/chatController.js';
import validate from '../middleware/validate.js';
import { chatSchema } from '../validation/chatValidation.js';

const router = express.Router();

router.post('/', validate(chatSchema), chatBotResponse);

export default router;
