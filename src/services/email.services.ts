import { transporter } from '../config/email';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  static async sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"No Reply" <noreply@example.com>',
        to,
        subject,
        html
      });
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  static async sendVerificationEmail(to: string, verificationToken: string) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    const html = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>This link will expire in ${process.env.JWT_EXPIRES_IN_EMAIL_VERIFY_TOKEN || '10 minutes'}.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Email Verification',
      html
    });
  }
}
