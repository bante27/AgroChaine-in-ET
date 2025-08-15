import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Nodemailer transporter using .env credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // 1️⃣ Save message to MongoDB
    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    // 2️⃣ Auto-reply to client
    await transporter.sendMail({
      from: `"AgroChain Ethiopia" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your message!',
      text: `Hi ${name},\n\nThank you for contacting AgroChain Ethiopia. We have received your message and will respond shortly.\n\nYour message:\n${message}\n\nBest regards,\nAgroChain Ethiopia Team`,
    });

    // 3️⃣ Admin notification
    await transporter.sendMail({
      from: `"AgroChain Ethiopia" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // you can set another admin email if needed
      subject: `New Contact Message from ${name}`,
      text: `📬 New message received:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    });

    // 4️⃣ Respond to API
    res.status(201).json({
      message: 'Message sent successfully! A confirmation email has been sent to you.',
      data: newMessage,
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error. Failed to send message.' });
  }
});

export default router;
