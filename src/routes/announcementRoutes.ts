import express from "express";
import upload from "../config/multerConfig";
import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByCategory,
} from "../controllers/announcementController";

const router = express.Router();

// File upload middleware with error handling
const handleFileUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 }
]);

// Apply to both POST and PUT routes
const fileUploadMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleFileUpload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err.message || "File upload failed" 
      });
    }
    next();
  });
};

router.post("/announcements", fileUploadMiddleware, addAnnouncement);
router.get("/announcements", getAnnouncements);
router.get("/announcements/category", getAnnouncementsByCategory);
router.get("/announcements/:id", getAnnouncementById);
router.put("/announcements/:id", fileUploadMiddleware, updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

export default router;