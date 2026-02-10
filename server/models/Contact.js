import mongoose from 'mongoose';

/**
 * CONTACT FORM SUBMISSION MODEL
 * 
 * Purpose: Stores messages sent through the static contact form
 * 
 * Fields:
 * - name: Name of the sender
 * - email: Email for follow-up
 * - subject: Subject of the inquiry
 * - message: The actual text content
 * - attachments: Any files or voice clips attached
 */

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 5000
    },
    attachments: [{
        filename: String,
        path: String,
        mimetype: String,
        size: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'replied', 'archived'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
