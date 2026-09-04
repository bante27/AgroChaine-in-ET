import contactService from '../services/contactService.js';
import catchAsync from '../utils/catchAsync.js';

export const handleContactForm = catchAsync(async (req, res) => {
    const result = await contactService.handleContactForm(req.body, req.files);
    res.status(200).json(result);
});
