import nodemailer from 'nodemailer';
import { IEmailService } from '../interfaces/services.js';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Debug Diary - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Debug Diary</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}