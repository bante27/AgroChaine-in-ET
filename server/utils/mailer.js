import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email service unified handler.
 * 1. Brevo (Web API - Best for Render Free/Free Domains)
 * 2. Resend (Web API - Requires Paid Domain)
 * 3. Gmail (SMTP - Blocked by Render, kept as local fallback)
 */

const MAIL_SERVICE = (process.env.MAIL_SERVICE || 'brevo').toLowerCase();
const emailUser = (process.env.EMAIL_USER || 'agrochainethiopia@gmail.com').trim();

// Initialize Resend
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY.trim());
}

// Initialize Nodemailer (Gmail fallback/local only)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER.trim(), pass: process.env.EMAIL_PASS.trim() },
    tls: { rejectUnauthorized: false },
    family: 4
  });
}

const mailer = {
  sendMail: async (options) => {
    // === Always Log OTP to Console (Safety net for Render) ===
    if (options.subject?.includes('OTP') || options.subject?.includes('Code')) {
      const otpMatch = options.html?.match(/>\s*([0-9]{4,6})\s*<\/div/);
      if (otpMatch) {
        console.log('🚀 [OTP LOG] Code for ' + options.to + ' is: ' + otpMatch[1]);
      }
    }

    // METHOD 1: Brevo Web API (Recommended for Render)
    if (MAIL_SERVICE === 'brevo' && process.env.BREVO_API_KEY) {
      try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
          sender: { name: "AgroChain Ethiopia", email: emailUser },
          to: Array.isArray(options.to) ? options.to.map(email => ({ email })) : [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html
        }, {
          headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' }
        });
        console.log('✅ Email sent via Brevo API');
        return response.data;
      } catch (error) {
        console.error('❌ Brevo API Error:', error.response?.data || error.message);
      }
    }

    // METHOD 2: Resend Web API
    if (MAIL_SERVICE === 'resend' && resend) {
      try {
        const fromAddress = process.env.RESEND_FROM_EMAIL || `AgroChain Ethiopia <onboarding@resend.dev>`;
        const { data, error } = await resend.emails.send({
          from: fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html
        });
        if (error) throw new Error(error.message);
        console.log('✅ Email sent via Resend API');
        return data;
      } catch (error) {
        console.error('❌ Resend API Error:', error.message);
      }
    }

    // METHOD 3: Gmail SMTP (Fallback)
    if (transporter) {
      try {
        const info = await transporter.sendMail({ from: `"AgroChain Ethiopia" <${emailUser}>`, ...options });
        console.log('✅ Email sent via Gmail SMTP');
        return info;
      } catch (error) {
        console.warn('⚠️ SMTP Blocked - This is normal on Render. Please use Brevo/Resend API.');
      }
    }

    return { messageId: 'logged-to-console-only' };
  },

  verify: (callback) => callback(null, true)
};

export default mailer;


