import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Set Cloudinary storage in multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "my_uploads", // Your folder in Cloudinary
    allowed_formats: [
      "jpg", "jpeg", "png", "gif", // Images
      "pdf", "doc", "docx",         // Documents
      "mp4", "mov", "avi", "webm",  // Videos
      "mp3", "wav", "ogg"           // Audio
    ],
  }),
});

// Export upload middleware
const upload = multer({ storage });

export default upload;