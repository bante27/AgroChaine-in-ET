import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service unified handler.
 * Primary: Resend (Render compatible)
 * Fallback: Gmail / OTP Logging
 */

const MAIL_SERVICE = (process.env.MAIL_SERVICE || '').toLowerCase();
const emailUser = (process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL || 'agrochainethiopia@gmail.com').trim();

// 1. Initialize Resend
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY.trim());
  console.log('📬 Resend initialized for email delivery');
}

// 2. Initialize Nodemailer (Gmail Fallback)
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
}

const mailer = {
  sendMail: async (options) => {
    // === Fallback for OTP Logging (Helpful for Render Debugging) ===
    if (options.subject?.includes('OTP') || options.subject?.includes('Code')) {
      console.log('----------------------------------------------------');
      console.log(`🔑 [OTP FALLBACK] To: ${options.to}`);
      console.log(`📝 Subject: ${options.subject}`);
      const otpMatch = options.html?.match(/>\s*([0-9]{4,6})\s*<\/div/);
      if (otpMatch) {
        console.log(`🚀 CODE IS: ${otpMatch[1]}`);
      }
      console.log('----------------------------------------------------');
    }

    // A. Use Resend (Primary)
    if (MAIL_SERVICE === 'resend' || (!transporter && resend)) {
      try {
        if (!resend) throw new Error('Resend API Key missing');

        // logic for 'from' address:
        // By default, if domain is not verified, Resend requires 'onboarding@resend.dev'
        // Once verified, we should use a domain-specific address.
        let fromAddress = `AgroChain Ethiopia <onboarding@resend.dev>`;

        // If you have verified your domain, change this to your domain email
        // example: noreply@agrochainethiopia.com
        if (process.env.RESEND_FROM_EMAIL) {
          fromAddress = process.env.RESEND_FROM_EMAIL;
        }

        console.log(`📨 Attempting to send email to ${options.to} via Resend...`);

        const { data, error } = await resend.emails.send({
          from: options.from || fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html
        });

        if (error) {
          throw new Error(error.message);
        }

        console.log('✅ Email sent via Resend:', data.id);
        return data;
      } catch (error) {
        console.error('❌ Resend Error:', error.message);

        if (error.message.includes('not authorized') || error.message.includes('unverified')) {
          console.warn('⚠️ PRO TIP: Your Resend domain is likely still PENDING verification. Email was NOT sent to secondary recipients.');
        }

        if (transporter) {
          console.log('🔄 Falling back to Gmail...');
        } else {
          throw error;
        }
      }
    }

    // B. Use Gmail (Fallback)
    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"AgroChain Ethiopia" <${emailUser}>`,
          ...options
        });
        console.log('✅ Email sent via Gmail:', info.messageId);
        return info;
      } catch (error) {
        console.warn('⚠️ Gmail Failed (likely blocked by Render):', error.message);
        return { messageId: 'logged-to-console' };
      }
    }

    throw new Error('No email service configured');
  },

  verify: (callback) => {
    if (MAIL_SERVICE === 'resend') return callback(null, true);
    if (transporter) {
      transporter.verify(callback);
    } else {
      callback(null, true);
    }
  },

  isResend: MAIL_SERVICE === 'resend' || (!transporter && !!resend)
};

export default mailer;

