import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  contactForm: (data: { name: string; email: string; message: string }) => ({
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
    text: `
      New Contact Form Submission
      Name: ${data.name}
      Email: ${data.email}
      Message: ${data.message}
    `,
  }),
  
  welcome: (name: string) => ({
    subject: 'Welcome to BouwMeesters Amsterdam',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for contacting us. We will get back to you soon.</p>
    `,
    text: `Welcome ${name}! Thank you for contacting us. We will get back to you soon.`,
  }),
};
