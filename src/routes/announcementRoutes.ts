import express from "express";
import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByCategory,
} from "../controllers/announcementController";
import upload from "../config/multerConfig"; // Use Cloudinary multer config

const router = express.Router();

// Add a new announcement with file uploads
router.post(
  "/announcements",
  upload.fields([
    { name: "image", maxCount: 1 }, // Allow one image file
    { name: "video", maxCount: 1 }, // Allow one video file
    { name: "pdf", maxCount: 1 },   // Allow one PDF file
  ]),
  addAnnouncement
);

// Get all announcements
router.get("/announcements", getAnnouncements);

// Get announcements by category
router.get("/announcements/category", getAnnouncementsByCategory);

// Get an announcement by ID
router.get("/announcements/:id", getAnnouncementById);

// Update an announcement
router.put(
  "/announcements/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateAnnouncement
);

// Delete an announcement
router.delete("/announcements/:id", deleteAnnouncement);

export default router;