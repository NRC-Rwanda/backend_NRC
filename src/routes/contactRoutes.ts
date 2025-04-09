import express from "express";
import { sendContactMessage } from "../controllers/contactController";

const router = express.Router();

// POST route to handle contact form submissions
router.post("/contact", sendContactMessage);

export default router;