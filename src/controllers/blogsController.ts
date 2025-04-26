import { Request, Response } from "express";
import Blog from "../models/blogs";



export const addBlog = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, longDescription } = req.body;

    const video = (req.files as any)?.video?.[0]?.filename || "";
    const pdf = (req.files as any)?.pdf?.[0]?.filename || "";
    const image = (req.files as any)?.image?.[0]?.filename || "";

    const blog = await Blog.create({
      title,
      shortDescription,
      longDescription,
      video,
      pdf,
      image,
    });

    const host = `${req.protocol}://${req.get("host")}`; 

    res.status(201).json({
      success: true,
      data: {
        ...blog.toJSON(),
        videoUrl: video ? `${host}/uploads/${video}` : null,
        pdfUrl: pdf ? `${host}/uploads/${pdf}` : null,
        imageUrl: image ? `${host}/uploads/${image}` : null,
      },
    });
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