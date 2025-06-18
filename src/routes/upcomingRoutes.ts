import express from "express";
import upload from "../config/multerConfig";
import {
  createUpcomingEvent,
  getAllUpcomingEvents,
  getUpcomingEventById,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  getUpcomingEventsByDate
} from "../controllers/UpcomingEventController";
const router = express.Router();

// File upload middleware with error handling
const handleFileUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 }
]);

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

// Create event with optional image
router.post("/events", fileUploadMiddleware, createUpcomingEvent);

// Get all events
router.get("/events", getAllUpcomingEvents);

// Get events by date range
router.get("/events/date-range", getUpcomingEventsByDate);

// Get single event
router.get("/events/:id", getUpcomingEventById);

// Update event with optional image
router.put("/events/:id", fileUploadMiddleware, updateUpcomingEvent);

// Delete event
router.delete("/events/:id", deleteUpcomingEvent);

export default router;