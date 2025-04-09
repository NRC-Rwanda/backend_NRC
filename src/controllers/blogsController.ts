import { Request, Response } from "express";
import Blog from "../models/blogs";

// Add a new blog
export const addBlog = async (req: Request, res: Response) => {
  const { title, content, video, pdf, image } = req.body; // Include the image field

  try {
    const blog = await Blog.create({
      title,
      content,
      video,
      pdf,
      image, // Add the image field to the blog creation
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("Error adding blog:", err);
    res.status(500).json({ success: false, error: "Failed to add blog" });
  }
};

// Get all blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ success: false, error: "Failed to fetch blogs" });
  }
};

// Get a blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({ success: false, error: "Blog not found" });
      return;
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    res.status(500).json({ success: false, error: "Failed to fetch blog" });
  }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      res.status(404).json({ success: false, error: "Blog not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ success: false, error: "Failed to delete blog" });
  }
};