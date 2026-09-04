import Contact from '../models/Contact.js';
import transporter from '../utils/mailer.js';
import AppError from '../utils/appError.js';

class ContactService {
    async handleContactForm({ name, email, subject, message }, files) {
        if (!name || !email || !subject || !message) {
            throw new AppError('All fields are required', 400);
        }

        const maskedEmail = email.replace(/^(..)(.*)(@.*)$/, '$1***$3');
        console.log(`[ContactForm] Submission received from ${maskedEmail} | Subject: ${subject}`);

        if (files) {
            const fileSummary = Object.keys(files).map(key => `${key}: ${files[key].length}`).join(', ');
            console.log(`[ContactForm] Attachments received: ${fileSummary}`);
        }

        const attachments = [];
        const attachmentLinks = [];

        if (files?.files && Array.isArray(files.files)) {
            files.files.forEach((file, index) => {
                let url = file.path || file.location || file.secure_url || file.url;
                if (url) {
                    if (typeof url === 'string' && url.startsWith('http:')) {
                        url = url.replace('http:', 'https:');
                    }
                    attachments.push({ filename: file.originalname || 'attachment', path: url, contentType: file.mimetype });
                    attachmentLinks.push({ filename: file.originalname || 'attachment', path: url, mimetype: file.mimetype, size: file.size });
                }
            });
        }

        if (files?.voice && Array.isArray(files.voice)) {
            files.voice.forEach((file, index) => {
                let url = file.path || file.location || file.secure_url || file.url;
                if (url) {
                    if (typeof url === 'string' && url.startsWith('http:')) {
                        url = url.replace('http:', 'https:');
                    }
                    attachments.push({ filename: file.originalname || 'voice_message.webm', path: url, contentType: file.mimetype || 'audio/webm' });
                    attachmentLinks.push({ filename: file.originalname || 'voice_message', path: url, mimetype: file.mimetype || 'audio/webm', size: file.size });
                }
            });
        }

        const newContact = new Contact({ name, email, subject, message, attachments: attachmentLinks });
        const savedMsg = await newContact.save();
        console.log(`[ContactForm] Saved to DB. ID: ${savedMsg._id.toString().slice(-6)}`);

        // Background worker for emails
        (async () => {
            try {
                let adminHtml = `
                    <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                      <h2 style="color: #111827; font-size: 18px; margin-top: 0;">📩 New Contact Form Submission</h2>
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
                          <div style="padding: 10px; background: ${isAudio ? '#fff7ed' : '#f0fdf4'}; border-radius: 8px; border: 1px solid ${isAudio ? '#ffedd5' : '#dcfce7'};">
                            <span style="font-size: 13px; font-weight: 600; color: ${isAudio ? '#9a3412' : '#166534'};">${isAudio ? '🎤 Voice' : '📎 Doc'}: ${a.filename}</span><br>
                            <a href="${safeUrl}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 4px 10px; background: #10b981; color: white; text-decoration: none; border-radius: 4px; font-size: 11px; font-weight: bold;">Open Asset ↗</a>
                          </div>
                        `;
                    });
                    adminHtml += "</div></div>";
                }

                const adminEmailOptions = {
                    to: [process.env.EMAIL_USER, 'info@agrochain.et', 'agrochainethiopia@gmail.com'],
                    replyTo: email,
                    subject: `📩 [Contact Inquiry] ${subject} - from ${name}`,
                    html: adminHtml,
                };

                if (attachments.length > 0) {
                    adminEmailOptions.attachments = attachments;
                }

                await transporter.sendMail(adminEmailOptions);

                await transporter.sendMail({
                    to: email,
                    subject: `Re: ${subject}`,
                    html: `
                        <p style="font-size: 18px; color: #111827; margin-top: 0;">Hi ${name},</p>
                        <p style="color: #374151; line-height: 1.6;">Thank you for contacting us. We have received your message regarding "<strong>${subject}</strong>".</p>
                        <div style="margin: 25px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                          <p style="margin: 0; font-style: italic; color: #166534;">"We are committed to empowering Ethiopian agriculture through technology."</p>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">Our team will get back to you shortly.</p>
                    `
                });
            } catch (bgError) {
                console.error("[ContactForm] Background email worker failed:", bgError.message);
            }
        })();

        return { success: true };
    }
}

export default new ContactService();
