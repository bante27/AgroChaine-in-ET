import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service using Resend API.
 * This is used because SMTP (Nodemailer) times out on Render.
 */

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY not set - email sending will fail!');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const mailer = {
  sendMail: async (options) => {
    try {
      const { from, to, subject, html, attachments } = options;

      // Convert attachments to Resend format
      const resendAttachments = attachments?.map(a => ({
        filename: a.filename,
        content: a.content || a.path, // Resend accepts URL or base64
      })) || [];

      if (!resend) {
        console.error('❌ Resend not initialized - check RESEND_API_KEY');
        return;
      }

      const { data, error } = await resend.emails.send({
        from: from || process.env.MAIL_FROM || `AgroChain Ethiopia <onboarding@resend.dev>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined
      });

      if (error) {
        console.error('❌ Resend send error:', error);
        // Special handling for testing limit
        if (error.statusCode === 403 && error.name === 'validation_error') {
          const enhancedError = new Error('Email sending restricted: You can only send to your own email until you verify your domain at Resend.com.');
          enhancedError.statusCode = 403;
          throw enhancedError;
        }
        throw error;
      }

      console.log('✅ Email sent successfully via Resend:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Mailer error (Resend):', error);
      throw error;
    }
  },

  verify: (callback) => {
    if (process.env.RESEND_API_KEY) {
      callback(null, true);
    } else {
      callback(new Error('RESEND_API_KEY not configured'), false);
    }
  },

  isResend: true
};

export default mailer;
