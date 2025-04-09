import express from "express";
import {
  addOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunirtyController";

const router = express.Router();

// Add a new opportunity
router.post("/opportunities", addOpportunity);

// Get all opportunities
router.get("/opportunities", getOpportunities);

// Get an opportunity by ID
router.get("/opportunities/:id", getOpportunityById);

// Update an opportunity
router.put("/opportunities/:id", updateOpportunity);

// Delete an opportunity
router.delete("/opportunities/:id", deleteOpportunity);

export default router;