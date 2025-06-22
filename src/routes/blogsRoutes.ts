import express from "express";
import upload from "../config/multerConfig";
import {
  addBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controllers/blogsController";

const router = express.Router();

// Reusable file upload middleware with error handling
const fileUploadMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ])(req, res, (err: any) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed',
        ...(process.env.NODE_ENV === 'development' && { details: err })
      });
    }
    next();
  });
};

// Add a new blog with file uploads
router.post("/blogs", fileUploadMiddleware, addBlog);

// Get all blogs
router.get("/blogs", getBlogs);

// Get a single blog by ID
router.get("/blogs/:id", getBlogById);

// Update a blog with file uploads
router.put("/blogs/:id", fileUploadMiddleware, updateBlog);

// Delete a blog
router.delete("/blogs/:id", deleteBlog);

export default router;