"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcementController_1 = require("../controllers/announcementController");
const router = express_1.default.Router();
// Add a new announcement
router.post("/announcements", announcementController_1.addAnnouncement);
// Get all announcements
router.get("/announcements", announcementController_1.getAnnouncements);
// Get an announcement by ID
router.get("/announcements/:id", announcementController_1.getAnnouncementById);
// Update an announcement
router.put("/announcements/:id", announcementController_1.updateAnnouncement);
// Delete an announcement
router.delete("/announcements/:id", announcementController_1.deleteAnnouncement);
exports.default = router;
