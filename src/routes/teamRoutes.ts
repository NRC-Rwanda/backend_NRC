import express from "express";
import {
  addTeamMember,
  getTeamMembers,
  getTeamMembersByCategory,
  deleteTeamMember,
  updateTeamMember,
} from "../controllers/teamController";

const router = express.Router();

// Add a new team member
router.post("/team", addTeamMember);

// Get all team members
router.get("/team", getTeamMembers);

// Update a team member
router.put("/team/:id", updateTeamMember);

// Get team members by category (e.g., "current" or "alumnae")
router.get("/team/category/:category", getTeamMembersByCategory);

// Delete a team member
router.delete("/team/:id", deleteTeamMember);

export default router;