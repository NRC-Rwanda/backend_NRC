import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";
import ContactMessage, { IContactMessage } from "../models/contact";

export const sendContactMessage = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  try {
    // Validate the input
    if (!name || !email || !phone || !message) {
      res.status(400).json({ success: false, error: "All fields are required" });
      return;
    }

    // Create and save the message in database
    const newMessage = new ContactMessage({ name, email, phone, message });
    await newMessage.save();

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

    res.status(201).json({ 
      success: true, 
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (err) {
    console.error("Error sending contact message:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

// Get all contact messages
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

// Get a single message by ID
export const getMessageById = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
    res.status(404).json({ success: false, error: "Message not found" });
      return;  
  }
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).json({ success: false, error: "Failed to fetch message" });
  }
};

// Update a message
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, message },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      res.status(404).json({ success: false, error: "Message not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedMessage });
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ success: false, error: "Failed to update message" });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!deletedMessage) {
      res.status(404).json({ success: false, error: "Message not found" });
      return;
    }

    res.status(200).json({ 
      success: true, 
      message: "Message deleted successfully",
      data: deletedMessage
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
};