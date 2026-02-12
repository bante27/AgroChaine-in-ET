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
  host: 'smtp.gmail.com',
  port: 465, // Using port 465 (SSL) for better reliability on cloud hosts
  secure: true,
  auth: {
    user: (process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL || '').trim(),
    pass: (process.env.EMAIL_PASS || process.env.NODEMAILER_PASS || '').trim(),
  },
  tls: {
    rejectUnauthorized: false
  },
  // Force IPv4 to avoid ENETUNREACH on IPv6 addresses in cloud environments like Render
  family: 4
});

console.log('📬 Mailer initialized with user:', process.env.EMAIL_USER ? process.env.EMAIL_USER.slice(0, 3) + '***@' + process.env.EMAIL_USER.split('@')[1] : 'MISSING');

const mailer = {
  sendMail: async (options) => {
    try {
      if (!transporter) {
        console.error('❌ Nodemailer transporter not initialized');
        return;
      }

      // Merge defaults with options
      const emailUser = (process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL || 'agrochainethiopia@gmail.com').trim();
      const mailOptions = {
        from: `"AgroChain Ethiopia" <${emailUser}>`,
        ...options
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('✅ Email sent successfully via Gmail:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Mailer error (Gmail):', error.message);
      throw error;
    }
  },

  verify: (callback) => {
    if (transporter) {
      transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP Connection Error:', error.message);
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
