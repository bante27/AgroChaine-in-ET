import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Unified mailer that supports Resend and Nodemailer.
 * If RESEND_API_KEY is present, it uses Resend.
 * Otherwise, it falls back to Nodemailer (SMTP).
 */
const getMailer = () => {
  const isResendEnabled = !!process.env.RESEND_API_KEY;

  if (isResendEnabled) {
    console.log('Mailer: Using Resend API');
    const resend = new Resend(process.env.RESEND_API_KEY);

    return {
      sendMail: async (options) => {
        const { from, to, subject, html, attachments } = options;

        // Resend attachment format conversion
        const resendAttachments = attachments?.map(a => ({
          filename: a.filename,
          path: a.path,
          content: a.content
        }));

        const { data, error } = await resend.emails.send({
          from: from || `AgroChain <onboarding@resend.dev>`,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          attachments: resendAttachments
        });

        if (error) {
          console.error('Resend send error:', error);
          throw error;
        }
        return data;
      },
      verify: (callback) => {
        // Resend doesn't need verification like SMTP
        callback(null, true);
      },
      isResend: true
    };
  } else {
    console.log('Mailer: Using Nodemailer (SMTP)');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    return {
      sendMail: (options) => transporter.sendMail(options),
      verify: (callback) => transporter.verify(callback),
      isResend: false
    };
  }
};

const mailer = getMailer();
export default mailer;
