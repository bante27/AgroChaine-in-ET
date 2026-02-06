import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service using Nodemailer (Gmail SMTP).
 * Switched from Resend due to domain verification limits.
 */

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set - email sending will fail!');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailer = {
  sendMail: async (options) => {
    try {
      const { from, to, subject, html, attachments } = options;

      if (!transporter) {
        console.error('❌ Nodemailer transporter not initialized');
        return;
      }

      const info = await transporter.sendMail({
        from: from || `"AgroChain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        html,
        attachments: attachments,
      });

      console.log('✅ Email sent successfully via Gmail:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Mailer error (Gmail):', error);
      throw error;
    }
  },

  verify: (callback) => {
    if (transporter) {
      transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP Connection Error:', error);
          callback(error, false);
        } else {
          console.log('✅ SMTP Connection Verified');
          callback(null, true);
        }
      });
    } else {
      callback(new Error('Transporter not initialized'), false);
    }
  },

  isResend: false
};

export default mailer;
