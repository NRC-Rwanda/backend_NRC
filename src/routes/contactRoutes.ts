import express from "express";
import {
  sendContactMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage
} from "../controllers/contactController";

const router = express.Router();

// Contact form submission
router.post("/contact", sendContactMessage);

// Get all messages (for admin dashboard)
router.get("/messages", getAllMessages);

// Get single message
router.get("/messages/:id", getMessageById);

// Delete a message
router.delete("delete/:id", deleteMessage);

export default router;