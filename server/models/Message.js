import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  attachments: [
    {
      filename: String,
      path: String, // Cloudinary URL
      mimetype: String,
      size: Number,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);