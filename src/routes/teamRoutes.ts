import express from "express";
import multer from "multer";
import path from "path";
import { addTeamMember ,
  getTeamMembers,
  getTeamMembersByCategory,
  updateTeamMember,
  deleteTeamMember
} from "../controllers/teamController";

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

const upload = multer({ storage });

const router = express.Router();

// Add a new team member with file upload
router.post("/team", upload.single("image"), addTeamMember);


// Get all team members
router.get("/team", getTeamMembers);

// Get team members by category
router.get("/team/category/:category", getTeamMembersByCategory);

// Update a team member with file upload
router.put("/team/:id", upload.single("image"), updateTeamMember);

// Delete a team member
router.delete("/team/:id", deleteTeamMember);

export default router;