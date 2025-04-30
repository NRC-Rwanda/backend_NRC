"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessage = exports.getMessageById = exports.getAllMessages = exports.sendContactMessage = void 0;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const contact_1 = __importDefault(require("../models/contact"));
const sendContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, message } = req.body;
    try {
        // Validate the input
        if (!name || !email || !phone || !message) {
            res.status(400).json({ success: false, error: "All fields are required" });
            return;
        }
        // Create and save the message in database
        const newMessage = new contact_1.default({ name, email, phone, message });
        yield newMessage.save();
        // Prepare the email content
        const emailContent = `
      You have a new contact form submission:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `;
        // Use the sendEmail utility to send the message
        yield (0, sendEmail_1.default)({
            email: process.env.EMAIL_USERNAME, // Send to your email address
            subject: "New Contact Form Submission",
            message: emailContent,
        });
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    }
    catch (err) {
        console.error("Error sending contact message:", err);
        res.status(500).json({ success: false, error: "Failed to send message" });
    }
});
exports.sendContactMessage = sendContactMessage;
// Get all contact messages
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield contact_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    }
    catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
});
exports.getAllMessages = getAllMessages;
// Get a single message by ID
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield contact_1.default.findById(req.params.id);
        if (!message) {
            res.status(404).json({ success: false, error: "Message not found" });
            return;
        }
        res.status(200).json({ success: true, data: message });
    }
    catch (err) {
        console.error("Error fetching message:", err);
        res.status(500).json({ success: false, error: "Failed to fetch message" });
    }
});
exports.getMessageById = getMessageById;
// Update a message
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        const updatedMessage = yield contact_1.default.findByIdAndUpdate(req.params.id, { name, email, phone, message }, { new: true, runValidators: true });
        if (!updatedMessage) {
            res.status(404).json({ success: false, error: "Message not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedMessage });
    }
    catch (err) {
        console.error("Error updating message:", err);
        res.status(500).json({ success: false, error: "Failed to update message" });
    }
});
exports.updateMessage = updateMessage;
// Delete a message
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMessage = yield contact_1.default.findByIdAndDelete(req.params.id);
        if (!deletedMessage) {
            res.status(404).json({ success: false, error: "Message not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: deletedMessage
        });
    }
    catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ success: false, error: "Failed to delete message" });
    }
});
exports.deleteMessage = deleteMessage;
