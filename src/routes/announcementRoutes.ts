import express from "express";
import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController";

const router = express.Router();

// Add a new announcement
router.post("/announcements", addAnnouncement);

// Get all announcements
router.get("/announcements", getAnnouncements);

// Get an announcement by ID
router.get("/announcements/:id", getAnnouncementById);

// Update an announcement
router.put("/announcements/:id", updateAnnouncement);

// Delete an announcement
router.delete("/announcements/:id", deleteAnnouncement);

export default router;