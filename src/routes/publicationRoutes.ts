import express from "express";
import {
  addPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publicationController";
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

// Add a new publication with file uploads
router.post(
  "/publications",
  upload.fields([
    { name: "image", maxCount: 1 }, // Allow one image file
    { name: "video", maxCount: 1 }, // Allow one video file
    { name: "pdf", maxCount: 1 },   // Allow one PDF file
  ]),
  addPublication
);

// Get all publications
router.get("/publications", getPublications);

// Get a publication by ID
router.get("/publications/:id", getPublicationById);

// Update a publication
router.put(
  "/publications/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updatePublication
);

// Delete a publication
router.delete("/publications/:id", deletePublication);

export default router;