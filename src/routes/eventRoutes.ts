// src/routes/event.routes.ts
import express from "express";
import upload from "../config/multerConfig";
import { createEvent } from "../controllers/event";

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createEvent
);

export default router;
