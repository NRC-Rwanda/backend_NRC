import express from "express";
import { addPublication, getPublications, getPublicationsByCategory, deletePublication } from "../controllers/publicationController";
import upload from "../config/multerConfig"; // Import the multer configuration

const router = express.Router();

// Route to add a publication with file uploads
router.post(
  "/publications",
  upload.fields([
    { name: "image", maxCount: 1 }, // Allow one image file
    { name: "pdf", maxCount: 1 },   // Allow one PDF file
    { name: "video", maxCount: 1 }, // Allow one video file
  ]),
  addPublication
);

// Route to get all publications
router.get("/publications", getPublications);

// Route to get publications by category
router.get("/publications/category/:category", getPublicationsByCategory);

// Route to delete a publication
router.delete("/publications/:id", deletePublication);

export default router;