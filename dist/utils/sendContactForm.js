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
exports.handleContactForm = exports.sendContactEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create reusable transporter
const transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE || "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
/**
 * Generic email sender function
 */
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'NRC Team'}" <${process.env.EMAIL_FROM || 'noreply@nrc.org'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`,
        };
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error("Email sending error:", error);
        return false;
    }
});
exports.sendEmail = sendEmail;
/**
 * Specialized function for contact form messages
 */
const sendContactEmail = (formData) => __awaiter(void 0, void 0, void 0, function* () {
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
    return (0, exports.sendEmail)({
        email: process.env.CONTACT_FORM_RECIPIENT || process.env.EMAIL_USERNAME,
        subject,
        message: text,
        html
    });
});
exports.sendContactEmail = sendContactEmail;
/**
 * Express middleware for contact form submission
 */
const handleContactForm = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, message } = req.body;
    // Validate required fields
    if (!name || !email || !phone || !message) {
        throw new Error("All fields are required");
    }
    // Send the email
    const success = yield (0, exports.sendContactEmail)({ name, email, phone, message });
    if (!success) {
        throw new Error("Failed to send message");
    }
    return { success: true, message: "Message sent successfully" };
});
exports.handleContactForm = handleContactForm;
exports.default = exports.sendEmail;
