import express from "express";
import upload from "../config/multerConfig";
import {
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  getTeamMembersByCategory,
  updateTeamMember,
  deleteTeamMember
} from "../controllers/teamController";

const router = express.Router();

// File upload middleware with error handling
const handleFileUpload = upload.single("image");

const fileUploadMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleFileUpload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err.message || "Image upload failed" 
      });
    }
    next();
  });
};

// Add a new team member with image upload
router.post("/team", fileUploadMiddleware, addTeamMember);

// Get all team members
router.get("/team", getTeamMembers);

// Get a specific team member
router.get("/team/:id", getTeamMemberById);

// Get team members by category
router.get("/team/category/:category", getTeamMembersByCategory);

// Update a team member with image upload
router.put("/team/:id", fileUploadMiddleware, updateTeamMember);

// Delete a team member
router.delete("/team/:id", deleteTeamMember);

export default router;