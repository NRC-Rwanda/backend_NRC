import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Validate Cloudinary config
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}

// Cloudinary config with timeout settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000, // 60 seconds timeout
});

// Enhanced resource type detection
const getResourceType = (mimetype: string): string => {
  const typeMap: Record<string, string> = {
    'video/': 'video',
    'image/': 'image',
    'application/pdf': 'raw',
    'application/msword': 'raw',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'raw',
    'audio/': 'video',
  };

  for (const [prefix, type] of Object.entries(typeMap)) {
    if (mimetype.startsWith(prefix)) return type;
  }
  return 'auto';
};

// Cloudinary storage with optimized settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const params: any = {
      folder: "my_uploads",
      resource_type: getResourceType(file.mimetype),
      chunk_size: 20 * 1024 * 1024, // 20MB chunks
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    // Type-specific optimizations
    if (file.mimetype.startsWith('image/')) {
      params.quality = 'auto';
      params.transformation = [{ width: 1000, height: 1000, crop: 'limit' }];
    } else if (file.mimetype.startsWith('video/')) {
      params.eager = [{ width: 640, height: 360, crop: 'pad', format: 'mp4' }];
      params.eager_async = true;
    }

    return params;
  },
});

// Enhanced file filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];

  cb(null, allowedMimeTypes.includes(file.mimetype));
};

// Configure multer with memory optimizations
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 3,
  },
  // Memory management
  preservePath: false,
});

export default upload;