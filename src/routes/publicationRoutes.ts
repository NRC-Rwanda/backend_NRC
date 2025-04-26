import express from "express";
import {
  addPublication,
  getPublications,
  getPublicationsByCategory,
  deletePublication,
} from "../controllers/publicationController";
import multer from "multer";

// Simple memory storage (you can later save to disk or upload to cloud)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Add a new publication
router.post("/publications",upload.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]), addPublication);

// Get all publications
router.get("/publications", getPublications);

// Get publications by category (e.g., "Research", "Reports", "Resources")
router.get("/publications/category/:category", getPublicationsByCategory);

// Delete a publication
router.delete("/publications/:id", deletePublication);

export default router;