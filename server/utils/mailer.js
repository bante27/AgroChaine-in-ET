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

const LOGO_URL = 'https://res.cloudinary.com/dnldn2lef/image/upload/v1771331787/agrochain_assets/agrochain_logo_email.png';

const mailer = {
  /**
   * Standardized tool to wrap HTML content with branding
   */
  wrapEmail: (html, title = 'AgroChain Ethiopia') => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: white; padding: 25px; text-align: center; border-bottom: 3px solid #10b981;">
          <img src="${LOGO_URL}" alt="AgroChain Logo" style="height: 70px; margin-bottom: 15px;" />
          <h1 style="margin: 0; font-size: 24px; color: #10b981; font-weight: 800; letter-spacing: 1px;">A<span style="color: #333; font-weight: 400;">grochain Ethiopia</span></h1>
        </div>
        <div style="padding: 35px; background: #ffffff; color: #1f2937; line-height: 1.7; font-size: 15.5px;">
          <p style="color: #10b981; font-weight: 600; font-size: 13px; text-transform: uppercase; margin-bottom: 25px; border-left: 4px solid #10b981; padding-left: 10px;">
            A Official Notification from AgroChain Ethiopia Team
          </p>
          ${html}
        </div>
        <div style="background: #f9fafb; padding: 25px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #f0f0f0;">
          <p style="margin: 0; font-weight: bold; color: #4b5563;">AgroChain Ethiopia</p>
          <p style="margin: 5px 0 0;">The Future of Digital Agriculture in Ethiopia</p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e5e7eb;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AgroChain Ethiopia. All rights reserved.</p>
            <p style="margin: 5px 0 0;">Addis Ababa, Ethiopia | <a href="mailto:info@agrochain.et" style="color: #10b981; text-decoration: none;">info@agrochain.et</a></p>
          </div>
        </div>
      </div>
    `;
  },

  sendMail: async (options) => {
    // === Always Log OTP to Console (Safety net for Render) ===
    // Check both subject and HTML to extract OTP for logs
    if (options.subject?.includes('OTP') || options.subject?.includes('Code') || options.subject?.includes('Verification')) {
      const otpMatch = options.html?.match(/>\s*([0-9]{4,6})\s*</) || options.html?.match(/([0-9]{4,6})/);
      if (otpMatch) {
        const maskedTo = options.to.toString().replace(/^(..)(.*)(@.*)$/, "$1***$3");
        console.log(`🚀 [OTP LOG] Code for ${maskedTo} is: ${otpMatch[1]}`);
      }
    }

    // If the HTML isn't already wrapped (simple check), wrap it
    if (options.html && !options.html.includes('agrochain_logo_email')) {
      options.html = mailer.wrapEmail(options.html, options.subject);
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


