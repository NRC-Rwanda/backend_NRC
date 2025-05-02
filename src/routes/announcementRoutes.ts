import express from "express";
import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByCategory,
} from "../controllers/announcementController";
import path from "path";
import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Generate a unique filename
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/quicktime", // .mov
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, PDFs, and videos are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

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