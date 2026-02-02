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
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const attachments = [];
    const attachmentLinks = [];

    // ===== Process general files =====
    if (req.files?.files && Array.isArray(req.files.files)) {
      req.files.files.forEach((file) => {
        const url = file.path || file.location; // Cloudinary URL
        if (url) {
          attachments.push({
            filename: file.originalname || 'attachment',
            path: url,
          });
          attachmentLinks.push({
            filename: file.originalname || 'attachment',
            path: url,
            mimetype: file.mimetype,
            size: file.size
          });
        }
      });
    }

    // ===== Process voice/audio =====
    if (req.files?.voice && Array.isArray(req.files.voice)) {
      req.files.voice.forEach((file) => {
        const url = file.path || file.location; // Cloudinary URL
        if (url) {
          attachments.push({
            filename: file.originalname || 'voice_message',
            path: url,
          });
          attachmentLinks.push({
            filename: file.originalname || 'voice_message',
            path: url,
          });
        }
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
        adminHtml += `<li>${a.filename}: <a href="${a.path}" target="_blank">${a.path}</a></li>`;
      });
      adminHtml += "</ul>";
    }
    // Send email to admin
    const adminEmailOptions = {
      from: `AgroChain Ethiopia <onboarding@resend.dev>`,
      to: 'tilahunsitotaw87@gmail.com', // Admin email
      subject: `📩 Contact Form: ${subject}`,
      html: adminHtml,
    };

    // Only add attachments if array has items
    if (attachments.length > 0) {
      adminEmailOptions.attachments = attachments;
    }

    // Send email to admin
    try {
      await transporter.sendMail(adminEmailOptions);
      console.log("Admin email sent");
    } catch (emailErr) {
      console.error("Admin notification email failed:", emailErr.message);
    }

    // Send auto-reply to user (no attachments)
    try {
      await transporter.sendMail({
        from: `AgroChain Ethiopia <onboarding@resend.dev>`,
        to: email,
        subject: `Re: ${subject}`,
        html: `<p>Hi ${name},</p>
         <p>Thank you for contacting us. We have received your message and will respond soon.</p>
         <p>Best regards,<br/>Agrochain Ethiopia Team</p>`
      });
      console.log("User auto-reply sent");
    } catch (emailErr) {
      console.error("User auto-reply email failed (likely Resend limitation):", emailErr.message);
    }

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || "Server error. Please try again later." });
  }
};
