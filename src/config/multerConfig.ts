import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Validate Cloudinary config
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper functions for resource type detection
const getResourceType = (mimetype: string): string => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'raw'; // PDFs are treated as 'raw' in Cloudinary
  if (mimetype === 'application/msword' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'raw';
  }
  if (mimetype.startsWith('audio/')) return 'video'; // Cloudinary treats audio as video
  return 'auto';
};

// Set Cloudinary storage in multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: "my_uploads",
      resource_type: getResourceType(file.mimetype),
      transformation: file.mimetype.startsWith('image/') 
        ? [{ width: 1000, height: 1000, crop: 'limit' }] 
        : undefined,
      chunk_size: 6000000,
    };
  },
});

// File filter with proper PDF support
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    // PDFs
    'application/pdf',
    // Documents
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Export upload middleware
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 3,
  }
});

export default upload;