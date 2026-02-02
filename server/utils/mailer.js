import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service using Nodemailer with Gmail.
 * This replaces Resend to ensure OTPs reach all users without domain verification restrictions.
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

const mailer = {
  sendMail: async (options) => {
    try {
      const { from, to, subject, html, attachments } = options;

      const mailOptions = {
        from: from || `"AgroChain Ethiopia" <${process.env.NODEMAILER_EMAIL}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments: attachments?.map(a => ({
          filename: a.filename,
          path: a.path,
          content: a.content,
          mimetype: a.mimetype, // Added mimetype
          size: a.size // Added size
        })) || []
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via Nodemailer:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Mailer error:', error);
      throw error;
    }
  },

  verify: (callback) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Nodemailer verification failed:', error);
        callback(error, false);
      } else {
        console.log('✅ Nodemailer is ready');
        callback(null, true);
      }
    });
  },

  isResend: false
};

export default mailer;
