import Message from "../models/Message.js";
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`, to, subject, html });
};

export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: "All fields are required" });

    const attachments = [];
    if (req.files?.files) {
      req.files.files.forEach(f => attachments.push({ filename: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size }));
    }
    if (req.files?.voice) {
      req.files.voice.forEach(f => attachments.push({ filename: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size }));
    }

    const newMessage = new Message({ name, email, subject, message, attachments });
    await newMessage.save();

    // Admin notification
    await sendEmail(process.env.EMAIL_USER, `📩 New Contact Form Submission: ${subject}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong> ${message}</p>`);

    // Auto-reply
    await sendEmail(email, "We Received Your Message - Agrochain Ethiopia",
      `<p>Hi ${name},</p>
       <p>Thank you for contacting us. We have received your message and will respond soon.</p>
       <p>Best regards,<br/>Agrochain Ethiopia Team</p>`);

    res.status(200).json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
