import Message from "../models/Message.js";
import nodemailer from "nodemailer";

// Helper function to send emails
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
      },
    });

    await transporter.sendMail({
      from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
  } catch (err) {
    console.error("Email send error:", err);
    throw new Error("Failed to send email");
  }
};

// Main contact form handler
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Prepare arrays for DB + email
    const attachments = [];
    const attachmentLinks = [];

    // Process files (general attachments)
    if (req.files?.files) {
      req.files.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.path, // Cloudinary URL
        });
        attachmentLinks.push({
          filename: file.originalname,
          url: file.path,
        });
      });
    }

    // Process voice (audio recording)
    if (req.files?.voice) {
      req.files.voice.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.path, // Cloudinary URL
        });
        attachmentLinks.push({
          filename: file.originalname,
          url: file.path,
        });
      });
    }

    // Save message in DB
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      attachments: attachmentLinks, // store URLs in MongoDB
    });

    await newMessage.save();
    console.log("Message saved to DB");

    // Email to admin
    let adminHtml = `
      <h2>📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    if (attachmentLinks.length > 0) {
      adminHtml += "<p><strong>Attachments:</strong></p><ul>";
      attachmentLinks.forEach((a) => {
        adminHtml += `<li>${a.filename}: <a href="${a.url}" target="_blank">${a.url}</a></li>`;
      });
      adminHtml += "</ul>";
    }

    await sendEmail(
      process.env.EMAIL_USER,
      `📩 Contact Form: ${subject}`,
      adminHtml,
      attachments // include files as attachments
    );
    console.log("Admin email sent");

    // Auto-reply to user
    await sendEmail(
      email,
      "✅ We Received Your Message - Agrochain Ethiopia",
      `<p>Hi ${name},</p>
       <p>Thank you for contacting us. We have received your message and will respond soon.</p>
       <p>Best regards,<br/>Agrochain Ethiopia Team</p>`
    );
    console.log("User auto-reply sent");

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};
