import nodemailer from "nodemailer";
import { Request } from "express";

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Generic email sender function
 */
export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'NRC Team'}" <${process.env.EMAIL_FROM || 'noreply@nrc.org'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

/**
 * Specialized function for contact form messages
 */
export const sendContactEmail = async (formData: ContactFormData) => {
  const subject = "New Contact Form Submission";
  const text = `
    You have a new contact form submission:
    
    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Message: ${formData.message}
  `;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
  `;

  return sendEmail({
    email: process.env.CONTACT_FORM_RECIPIENT || process.env.EMAIL_USERNAME!,
    subject,
    message: text,
    html
  });
};

/**
 * Express middleware for contact form submission
 */
export const handleContactForm = async (req: Request) => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !message) {
    throw new Error("All fields are required");
  }

  // Send the email
  const success = await sendContactEmail({ name, email, phone, message });
  
  if (!success) {
    throw new Error("Failed to send message");
  }

  return { success: true, message: "Message sent successfully" };
};

export default sendEmail;