"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicationController_1 = require("../controllers/publicationController");
const multerConfig_1 = __importDefault(require("../config/multerConfig")); // Import the multer configuration
const router = express_1.default.Router();
// Route to add a publication with file uploads
router.post("/publications", multerConfig_1.default.fields([
    { name: "image", maxCount: 1 }, // Allow one image file
    { name: "pdf", maxCount: 1 }, // Allow one PDF file
    { name: "video", maxCount: 1 }, // Allow one video file
]), publicationController_1.addPublication);
// Route to get all publications
router.get("/publications", publicationController_1.getPublications);
// Route to get publications by category
router.get("/publications/category/:category", publicationController_1.getPublicationsByCategory);
// Route to delete a publication
router.delete("/publications/:id", publicationController_1.deletePublication);
exports.default = router;
