import nodemailer from 'nodemailer';

// Create a test account if no email configuration is provided
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
};

// Create reusable transporter
export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log('Error with email configuration:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});
