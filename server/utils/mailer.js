import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service unified handler.
 * Supports Resend, Brevo (recommended), and Nodemailer (Gmail fallback).
 */

const MAIL_SERVICE = (process.env.MAIL_SERVICE || '').toLowerCase();
const emailUser = (process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL || 'agrochainethiopia@gmail.com').trim();

// 1. Initialize Resend
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY.trim());
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
}

const mailer = {
  sendMail: async (options) => {
    // === Fallback for OTP Logging (Helpful for students on Render) ===
    if (options.subject?.includes('OTP') || options.subject?.includes('Code')) {
      console.log('----------------------------------------------------');
      console.log(`🔑 [OTP FALLBACK] To: ${options.to}`);
      console.log(`📝 Subject: ${options.subject}`);
      // Simple regex to extract OTP from HTML if present
      const otpMatch = options.html?.match(/>\s*([0-9]{4,6})\s*<\/div/);
      if (otpMatch) {
        console.log(`🚀 CODE IS: ${otpMatch[1]}`);
      }
      console.log('----------------------------------------------------');
    }

    // A. Use Brevo (Highly recommended for students - no domain required)
    if (MAIL_SERVICE === 'brevo' && process.env.BREVO_API_KEY) {
      try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
          sender: { name: "AgroChain Ethiopia", email: emailUser },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html
        }, {
          headers: {
            'api-key': process.env.BREVO_API_KEY.trim(),
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Email sent via Brevo:', response.data.messageId);
        return response.data;
      } catch (error) {
        console.error('❌ Brevo Error:', error.response?.data || error.message);
      }
    }

    // B. Use Resend
    if (MAIL_SERVICE === 'resend' || (!transporter && resend)) {
      try {
        if (!resend) throw new Error('Resend API Key missing');
        const data = await resend.emails.send({
          from: options.from || `AgroChain Ethiopia <onboarding@resend.dev>`,
          to: options.to,
          subject: options.subject,
          html: options.html
        });
        console.log('✅ Email sent via Resend:', data.id);
        return data;
      } catch (error) {
        console.error('❌ Resend Error:', error.message);
      }
    }

    // C. Use Gmail (Default Fallback)
    if (transporter && MAIL_SERVICE !== 'brevo' && MAIL_SERVICE !== 'resend') {
      try {
        const info = await transporter.sendMail({
          from: `"AgroChain Ethiopia" <${emailUser}>`,
          ...options
        });
        console.log('✅ Email sent via Gmail:', info.messageId);
        return info;
      } catch (error) {
        console.warn('⚠️ Gmail Failed (likely blocked by Render):', error.message);
        // We already logged the OTP above, so the user can still proceed!
        return { messageId: 'logged-to-console' };
      }
    }

    return { messageId: 'simulated-sent' };
  },

  verify: (callback) => {
    if (MAIL_SERVICE === 'brevo' || MAIL_SERVICE === 'resend') {
      return callback(null, true);
    }
    if (transporter) {
      transporter.verify(callback);
    } else {
      callback(null, true);
    }
  },

  isResend: MAIL_SERVICE === 'resend'
};

export default mailer;
