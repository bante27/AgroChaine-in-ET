    import Message from "../models/Message.js";
import nodemailer from "nodemailer";

// Send Email Utility
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// Handle Contact Form
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to DB
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    // Send notification to Admin
    await sendEmail(
      process.env.EMAIL_USER,
      `📩 New Contact Form Submission: ${subject}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong> ${message}</p>`
    );

    // Send auto-reply to user
    await sendEmail(
      email,
      "We Received Your Message - Agrochain Ethiopia",
      `<p>Hi ${name},</p>
       <p>Thank you for contacting us. We have received your message and will respond soon.</p>
       <p>Best regards,<br/>Agrochain Ethiopia Team</p>`
    );

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
