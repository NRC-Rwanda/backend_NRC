import express from "express";
import upload from "../config/multerConfig";
import {
  createUpcomingEvent,
  getAllUpcomingEvents,
  // getUpcomingEventById,
  // updateUpcomingEvent,
  // deleteUpcomingEvent,
} from "../controllers/UpcomingEventController";

const router = express.Router();

router.post("/",upload.fields([{ name: "video" }, { name: "pdf" }, { name: "image" }]), createUpcomingEvent);
router.get("/", getAllUpcomingEvents);
// router.get("/:id", getUpcomingEventById);
// router.put("/:id",upload.fields([{ name: "video" }, { name: "pdf" }, { name: "image" }]), updateUpcomingEvent);
// router.delete("/:id", deleteUpcomingEvent);

export default router;
