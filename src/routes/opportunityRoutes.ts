import express from "express";
import {
  addOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunirtyController";
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

// Add a new opportunity
router.post("/opportunities",upload.fields([
  { name: "image", maxCount: 1 }, // Allow one image file
  { name: "video", maxCount: 1 }, // Allow one video file
  { name: "pdf", maxCount: 1 },   // Allow one PDF file
]), addOpportunity);

// Get all opportunities
router.get("/opportunities", getOpportunities);

// Get an opportunity by ID
router.get("/opportunities/:id", getOpportunityById);

// Update an opportunity
router.put("/opportunities/:id",upload.fields([
  { name: "image", maxCount: 1 }, // Allow one image file
  { name: "video", maxCount: 1 }, // Allow one video file
  { name: "pdf", maxCount: 1 },   // Allow one PDF file
]), updateOpportunity);

// Delete an opportunity
router.delete("/opportunities/:id", deleteOpportunity);

export default router;