"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
// Contact form submission
router.post("/contact", contactController_1.sendContactMessage);
// Get all messages (for admin dashboard)
router.get("/messages", contactController_1.getAllMessages);
// Get single message
router.get("/messages/:id", contactController_1.getMessageById);
// Update a message
router.put("/messages/:id", contactController_1.updateMessage);
// Delete a message
router.delete("delete/:id", contactController_1.deleteMessage);
exports.default = router;
