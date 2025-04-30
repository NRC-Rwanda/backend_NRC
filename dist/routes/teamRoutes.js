"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const teamController_1 = require("../controllers/teamController");
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads")); // Save files to the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
// Add a new team member with file upload
router.post("/team", upload.single("image"), teamController_1.addTeamMember);
// Get all team members
router.get("/team", teamController_1.getTeamMembers);
// Get team members by category
router.get("/team/category/:category", teamController_1.getTeamMembersByCategory);
// Update a team member with file upload
router.put("/team/:id", upload.single("image"), teamController_1.updateTeamMember);
// Delete a team member
router.delete("/team/:id", teamController_1.deleteTeamMember);
exports.default = router;
