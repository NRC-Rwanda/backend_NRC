import express from "express";
import {
  addPublication,
  getPublications,
  getPublicationsByCategory,
  deletePublication,
} from "../controllers/publicationController";

const router = express.Router();

// Add a new publication
router.post("/publications", addPublication);

// Get all publications
router.get("/publications", getPublications);

// Get publications by category (e.g., "Research", "Reports", "Resources")
router.get("/publications/category/:category", getPublicationsByCategory);

// Delete a publication
router.delete("/publications/:id", deletePublication);

export default router;