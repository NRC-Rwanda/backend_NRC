import express from "express";
import upload from "../config/multerConfig";
import {
  addBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
} from "../controllers/blogsController";

const router = express.Router();

// Add a new blog with file uploads
router.post(
  "/blogs",
  upload.fields([{ name: "video" }, { name: "pdf" }, { name: "image" }]),
  addBlog
);

// Get all blogs
router.get("/blogs", getBlogs); 

// Get a blog by ID
router.get("/blogs/:id", getBlogById);

// Delete a blog
router.delete("/blogs/:id", deleteBlog);

export default router;