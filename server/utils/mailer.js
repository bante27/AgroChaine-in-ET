import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Unified mailer using Nodemailer with Gmail SMTP.
 * 
 * IMPORTANT: This configuration is optimized for Gmail.
 * If you want to use Resend in the future, you need to:
 * 1. Verify your domain on Resend
 * 2. Set RESEND_API_KEY environment variable
 * 3. Uncomment the Resend code below
 */

console.log('Mailer: Using Nodemailer with Gmail SMTP');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
  } else {
    console.log('✅ Gmail SMTP server is ready to send emails');
  }
});

// Export a consistent interface
const mailer = {
  sendMail: (options) => transporter.sendMail(options),
  verify: (callback) => transporter.verify(callback),
  isResend: false
};

export default mailer;
