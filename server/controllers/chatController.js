import chatService from '../services/chatService.js';
import catchAsync from '../utils/catchAsync.js';

export const chatBotResponse = catchAsync(async (req, res) => {
    const reply = chatService.generateResponse(req.body.message);
    res.status(200).json({ reply });
});
