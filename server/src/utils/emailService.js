import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from './logger.js';

let transporter = null;

// Initialize transporter or fallback to test logger in development
try {
  if (config.email.user && config.email.pass) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }
} catch (err) {
  logger.warn('Email transporter could not be initialized with credentials; falling back to simulated logger.');
}

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        text,
        html
      });
      logger.info(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
      return info;
    } else {
      // In development or when credentials are not configured, log email link safely
      logger.info(`[SIMULATED EMAIL] To: ${to} | Subject: ${subject}`);
      logger.info(`[SIMULATED CONTENT]: ${text || html}`);
      return { simulated: true, to, subject };
    }
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    // Do not throw to avoid crashing primary request, return error status
    return { error: error.message };
  }
};

export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const subject = 'Verify Your University Alumni Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e3a8a;">Welcome to the Alumni Association, ${name}!</h2>
      <p style="color: #475569; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address. Once verified, your credentials will be submitted to the committee for academic verification.</p>
      <div style="margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">If you did not create this account, please disregard this email.</p>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Link expires in 24 hours.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html, text: `Please verify your email at: ${verificationUrl}` });
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e3a8a;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${name}, you recently requested to reset your password for your Alumni Association account. Click the button below to set a new password:</p>
      <div style="margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">If you did not request this, please ignore this email or notify administration.</p>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Link expires in 1 hour.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html, text: `Reset your password at: ${resetUrl}` });
};
