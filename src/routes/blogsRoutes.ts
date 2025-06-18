import express from "express";
import upload from "../config/multerConfig";
import {
  addBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controllers/blogsController";
import { Request, ParamsDictionary, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

const router = express.Router();

// Enhanced upload middleware with error handling
const handleFileUpload = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
  { name: "image", maxCount: 1 }
]);

// Add a new blog with file uploads
router.post("/blogs", (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: () => void) => {
  handleFileUpload(req, res, (err: any) => {
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
}, addBlog);

// Get all blogs with optional pagination
router.get("/blogs", getBlogs);

// Get a single blog by ID
router.get("/blogs/:id", getBlogById);

// Update a blog with file uploads
router.put("/blogs/:id", (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: () => void) => {
  handleFileUpload(req, res, (err: any) => {
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
}, updateBlog);

// Delete a blog
router.delete("/blogs/:id", deleteBlog);

export default router;