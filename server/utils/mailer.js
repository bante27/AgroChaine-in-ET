import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service unified handler.
 * Supports Resend (recommended for production/Render) and Nodemailer (Gmail fallback).
 */

const MAIL_SERVICE = (process.env.MAIL_SERVICE || '').toLowerCase();
const emailUser = (process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL || 'onboarding@resend.dev').trim();

// 1. Initialize Resend if key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY.trim());
  console.log('📬 Resend initialized for email delivery');
}

// 2. Initialize Nodemailer (Gmail)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASS.trim(),
    },
    tls: { rejectUnauthorized: false },
    family: 4
  });
  console.log('📬 Gmail Mailer initialized');
}

const mailer = {
  sendMail: async (options) => {
    // Try Resend first if explicitly requested or if no Gmail config
    if (MAIL_SERVICE === 'resend' || (!transporter && resend)) {
      try {
        if (!resend) throw new Error('Resend API Key missing');

        const data = await resend.emails.send({
          from: options.from || `AgroChain Ethiopia <onboarding@resend.dev>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
          attachments: options.attachments
        });

        console.log('✅ Email sent via Resend:', data.id);
        return data;
      } catch (error) {
        console.error('❌ Resend Error:', error.message);
        // Fallback to Gmail if Resend fails and Gmail is configured
        if (!transporter) throw error;
      }
    }

    // Default to Gmail/Nodemailer
    if (transporter) {
      try {
        const mailOptions = {
          from: `"AgroChain Ethiopia" <${emailUser}>`,
          ...options
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent via Gmail:', info.messageId);
        return info;
      } catch (error) {
        console.error('❌ Gmail Error:', error.message);
        throw error;
      }
    }

    throw new Error('No email service configured (Resend or Gmail)');
  },

  verify: (callback) => {
    if (MAIL_SERVICE === 'resend') {
      callback(null, true); // Resend doesn't need SMTP verification
      return;
    }
    if (transporter) {
      transporter.verify(callback);
    } else {
      callback(new Error('No transporter available'), false);
    }
  },

  isResend: MAIL_SERVICE === 'resend' || (!transporter && !!resend)
};

export default mailer;

