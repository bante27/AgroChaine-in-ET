import Message from "../models/Message.js";
import transporter from "../utils/mailer.js";

// Helper to send emails
// sendEmail is now using the unified transporter

// Main contact form handler
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const attachments = [];
    const attachmentLinks = [];

    // ===== Process general files =====
    if (req.files?.files) {
      req.files.files.forEach((file) => {
        const url = file.path || file.location; // Cloudinary URL
        attachments.push({
          filename: file.originalname,
          path: url,
        });
        attachmentLinks.push({
          filename: file.originalname,
          url,
        });
      });
    }

    // ===== Process voice/audio =====
    if (req.files?.voice) {
      req.files.voice.forEach((file) => {
        const url = file.path || file.location; // Cloudinary URL
        attachments.push({
          filename: file.originalname,
          path: url,
        });
        attachmentLinks.push({
          filename: file.originalname,
          url,
        });
      });
    }

    // ===== Save to MongoDB =====
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      attachments: attachmentLinks, // store URLs
    });
    await newMessage.save();
    console.log("Message saved to DB");

    // ===== Email to Admin =====
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

    await transporter.sendMail({
      from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 Contact Form: ${subject}`,
      html: adminHtml,
      attachments
    });
    console.log("Admin email sent");

    // ===== Auto-reply to user =====
    await transporter.sendMail({
      from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We Received Your Message - Agrochain Ethiopia",
      html: `<p>Hi ${name},</p>
       <p>Thank you for contacting us. We have received your message and will respond soon.</p>
       <p>Best regards,<br/>Agrochain Ethiopia Team</p>`
    });
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
