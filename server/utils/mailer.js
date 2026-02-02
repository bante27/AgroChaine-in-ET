import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service using Resend API.
 * Much more reliable than Gmail SMTP - no connection timeouts!
 * 
 * SETUP:
 * 1. Get Resend API key from https://resend.com/
 * 2. Set RESEND_API_KEY in environment variables
 * 3. Verify your domain on Resend (or use onboarding@resend.dev for testing)
 */

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY not set - email sending will fail!');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const mailer = {
  sendMail: async (options) => {
    try {
      const { from, to, subject, html, attachments } = options;

      // Convert attachments to Resend format
      const resendAttachments = attachments?.map(a => ({
        filename: a.filename,
        content: a.content || a.path, // Resend accepts URL or base64
      })) || [];

      const { data, error } = await resend.emails.send({
        from: from || `AgroChain Ethiopia <onboarding@resend.dev>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined
      });

      if (error) {
        console.error('❌ Resend send error:', error);
        throw error;
      }

      console.log('✅ Email sent successfully via Resend:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Mailer error:', error);
      throw error;
    }
  },

  verify: (callback) => {
    // Resend doesn't need verification like SMTP
    if (process.env.RESEND_API_KEY) {
      callback(null, true);
    } else {
      callback(new Error('RESEND_API_KEY not configured'), false);
    }
  },

  isResend: true
};

export default mailer;
