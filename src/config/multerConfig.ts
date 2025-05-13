// src/middleware/upload.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// Define allowed MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "video/mp4",
  "video/quicktime", // .mov
];

// File filter function with proper typing
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and videos are allowed"));
  }
};

// Export Multer upload instance
const upload = multer({ storage, fileFilter });

export default upload;
