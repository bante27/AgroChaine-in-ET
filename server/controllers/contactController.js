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

    console.log("--- CONTACT FORM DEBUG ---");
    console.log("Body:", { name, email, subject });
    console.log("Raw req.files:", req.files);

    if (req.files) {
      Object.keys(req.files).forEach(key => {
        console.log(`Field [${key}]: ${req.files[key].length} files`);
        req.files[key].forEach((f, i) => {
          console.log(`  File ${i}: ${f.originalname}, path: ${f.path || 'MISSING'}, mimetype: ${f.mimetype}`);
        });
      });
    }

    const attachments = [];
    const attachmentLinks = [];

    // ===== Process general files =====
    if (req.files?.files && Array.isArray(req.files.files)) {
      console.log(`Processing ${req.files.files.length} document files...`);
      req.files.files.forEach((file, index) => {
        let url = file.path || file.location || file.secure_url || file.url; // Cloudinary URL
        console.log(`  File ${index} raw data:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path ? 'exists' : 'null',
          secure_url: file.secure_url ? 'exists' : 'null',
          url: file.url ? 'exists' : 'null'
        });

        if (url) {
          // Force HTTPS
          if (typeof url === 'string' && url.startsWith('http:')) {
            url = url.replace('http:', 'https:');
          }

          attachments.push({
            filename: file.originalname || 'attachment',
            path: url,
            contentType: file.mimetype
          });

          attachmentLinks.push({
            filename: file.originalname || 'attachment',
            path: url,
            mimetype: file.mimetype,
            size: file.size
          });
          console.log(`  File ${index} processed successfully`);
        } else {
          console.warn(`  File ${index} has no URL/path!`);
        }
      });
    }

    // ===== Process voice/audio =====
    if (req.files?.voice && Array.isArray(req.files.voice)) {
      console.log(`Processing ${req.files.voice.length} voice files...`);
      req.files.voice.forEach((file, index) => {
        let url = file.path || file.location || file.secure_url || file.url; // Cloudinary URL
        console.log(`  Voice ${index} raw data:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path ? 'exists' : 'null',
          secure_url: file.secure_url ? 'exists' : 'null'
        });

        if (url) {
          // Force HTTPS
          if (typeof url === 'string' && url.startsWith('http:')) {
            url = url.replace('http:', 'https:');
          }

          attachments.push({
            filename: file.originalname || 'voice_message.webm',
            path: url,
            contentType: file.mimetype || 'audio/webm'
          });
          attachmentLinks.push({
            filename: file.originalname || 'voice_message',
            path: url,
            mimetype: file.mimetype || 'audio/webm',
            size: file.size
          });
          console.log(`  Voice ${index} processed successfully`);
        } else {
          console.warn(`  Voice ${index} has no URL/path!`);
        }
      });
    }

    // ===== Save to MongoDB =====
    console.log(`Processing ${attachmentLinks.length} attachments for DB storage`);
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      attachments: attachmentLinks, // store URLs
    });
    const savedMsg = await newMessage.save();
    console.log("Message saved to DB with ID:", savedMsg._id);
    console.log("Saved Attachments count:", savedMsg.attachments?.length || 0);

    // 🚀 FAST RESPONSE: Send success immediately to client
    res.status(200).json({ success: true, message: "Message sent successfully" });

    // 📧 BACKGROUND PROCESS: Send emails asynchronously
    (async () => {
      try {
        // ===== Email to Admin =====
        let adminHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #a0b910ff 0%, #380596ff 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px;">📩 New Contact Form Submission</h1>
              <p style="margin: 5px 0 0; opacity: 0.9;">AgroChain Ethiopia Portal</p>
            </div>
            
            <div style="padding: 25px; background: #ffffff;">
              <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0 0 5px; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold;">Sender Info</p>
                <p style="margin: 0; font-size: 15px; color: #111827;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0 0; font-size: 15px; color: #111827;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></p>
              </div>

              <div style="margin-bottom: 25px;">
                <p style="margin: 0 0 5px; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold;">Subject</p>
                <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${subject}</p>
              </div>

              <div style="margin-bottom: 25px; background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
        `;

        // Add links to body
        if (attachmentLinks.length > 0) {
          adminHtml += `
            <div style="padding: 0 25px 25px; background: #ffffff;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: bold;">📂 Attachments</p>
              <div style="display: grid; gap: 10px;">
          `;
          attachmentLinks.forEach((a) => {
            const safeUrl = a.path.startsWith('http') ? a.path : `${process.env.VITE_API_URL || 'http://localhost:5000'}${a.path}`;
            const isAudio = a.mimetype?.startsWith('audio') || a.filename?.endsWith('.webm');
            adminHtml += `
              <div style="padding: 10px; background: ${isAudio ? '#fff7ed' : '#f0fdf4'}; border-radius: 8px; border: 1px solid ${isAudio ? '#ffedd5' : '#dcfce7'}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <span style="font-size: 13px; font-weight: 600; color: ${isAudio ? '#9a3412' : '#166534'};">
                  ${isAudio ? '🎤 Voice' : '📎 Doc'}: ${a.filename}
                </span>
                <br>
                <a href="${safeUrl}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 4px 10px; background: #10b981; color: white; text-decoration: none; border-radius: 4px; font-size: 11px; font-weight: bold;">Open Asset ↗</a>
              </div>
            `;
          });
          adminHtml += "</div></div>";
        }

        adminHtml += `
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 11px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgroChain Ethiopia. Professional Contact Inquiry</p>
            </div>
          </div>
        `;

        const adminEmailOptions = {
          to: 'tilahunsitotaw87@gmail.com', // Primary admin email as requested
          bcc: process.env.EMAIL_USER,
          replyTo: email,
          subject: `📩 Contact Form: ${subject}`,
          html: adminHtml,
        };

        // Attach files physically for the icon in Gmail
        if (attachments.length > 0) {
          adminEmailOptions.attachments = attachments;
        }

        await transporter.sendMail(adminEmailOptions);
        console.log("✅ Admin notification sent to:", adminEmailOptions.to);

        // ===== Auto-reply to User =====
        await transporter.sendMail({
          to: email,
          subject: `Re: ${subject}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
              <div style="background: #10b981; padding: 25px; text-align: center;">
                <h2 style="color: white; margin: 0;">AgroChain Ethiopia</h2>
              </div>
              <div style="padding: 30px; background: #ffffff;">
                <p style="font-size: 18px; color: #111827; margin-top: 0;">Hi ${name},</p>
                <p style="color: #374151; line-height: 1.6;">Thank you for contacted us. We have received your message regarding "<strong>${subject}</strong>".</p>
                <div style="margin: 25px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                  <p style="margin: 0; font-style: italic; color: #166534;">"We are committed to empowering Ethiopian agriculture through technology."</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Best regards,<br><strong>The AgroChain Ethiopia Team</strong></p>
              </div>
            </div>
          `
        });
        console.log("✅ User auto-reply sent");

      } catch (bgError) {
        console.error("❌ Background email worker failed:", bgError);
      }
    })();
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || "Server error. Please try again later." });
  }
};
