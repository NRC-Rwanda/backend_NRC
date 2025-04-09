import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";

export const sendContactMessage = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  try {
    // Validate the input
    if (!name || !email || !phone || !message) {
    res.status(400).json({ success: false, error: "All fields are required" });
        return;
    }

    // Prepare the email content
    const emailContent = `
      You have a new contact form submission:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `;

    // Use the sendEmail utility to send the message
    await sendEmail({
      email: process.env.EMAIL_USERNAME!, // Send to your email address
      subject: "New Contact Form Submission",
      message: emailContent,
    });

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending contact message:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};