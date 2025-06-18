import { Request, Response } from "express";
import Blog from "../models/blogs";

interface IFileDictionary {
  [key: string]: Express.Multer.File[];
}

// Helper function to safely access files
const getFileUrl = (files: IFileDictionary | undefined, fieldName: string): string => {
  if (!files || !files[fieldName] || !files[fieldName][0]) return "";
  return files[fieldName][0].path || "";
};

// Add a new blog with proper type checking
export const addBlog = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, longDescription } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !longDescription) {
       res.status(400).json({ 
        success: false, 
        error: "Title, short description and long description are required" 
      });
      return;
    }

    const files = req.files as IFileDictionary;
    const videoUrl = getFileUrl(files, 'video');
    const pdfUrl = getFileUrl(files, 'pdf');
    const imageUrl = getFileUrl(files, 'image');

    const blog = await Blog.create({
      title,
      shortDescription,
      longDescription,
      video: videoUrl,
      pdf: pdfUrl,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: {
        id: blog._id,
        title: blog.title,
        shortDescription: blog.shortDescription,
        longDescription: blog.longDescription,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        imageUrl: imageUrl || null,
        createdAt: blog.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Error adding blog:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// Get all blogs with pagination
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.status(200).json({ 
      success: true, 
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err: any) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch blogs",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// Get a blog by ID with better error handling
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
       res.status(404).json({ 
        success: false, 
        error: "Blog not found" 
      });
      return;
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err: any) {
    console.error("Error fetching blog:", err);
    
    if (err.name === 'CastError') {
       res.status(400).json({ 
        success: false, 
        error: "Invalid blog ID format" 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch blog",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// Update a blog with proper validation
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, longDescription } = req.body;
    const files = req.files as IFileDictionary;

    // Build the update object
    const updateData: any = {
      ...(title && { title }),
      ...(shortDescription && { shortDescription }),
      ...(longDescription && { longDescription }),
    };

    // Only update file URLs if new files were uploaded
    const videoUrl = getFileUrl(files, 'video');
    const pdfUrl = getFileUrl(files, 'pdf');
    const imageUrl = getFileUrl(files, 'image');

    if (videoUrl) updateData.video = videoUrl;
    if (pdfUrl) updateData.pdf = pdfUrl;
    if (imageUrl) updateData.image = imageUrl;

    // Validate at least one field is being updated
    if (Object.keys(updateData).length === 0) {
       res.status(400).json({ 
        success: false, 
        error: "No valid fields provided for update" 
      });
      return;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
       res.status(404).json({ 
        success: false, 
        error: "Blog not found" 
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (err: any) {
    console.error("Error updating blog:", err);
    
    if (err.name === 'CastError') {
       res.status(400).json({ 
        success: false, 
        error: "Invalid blog ID format" 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to update blog",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// Delete a blog with error handling
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
       res.status(404).json({ 
        success: false, 
        error: "Blog not found" 
      });
      return;
    }

    // TODO: Add Cloudinary file deletion logic here if needed

    res.status(200).json({ 
      success: true, 
      message: "Blog deleted successfully",
      deletedBlog: {
        id: blog._id,
        title: blog.title,
      }
    });
  } catch (err: any) {
    console.error("Error deleting blog:", err);
    
    if (err.name === 'CastError') {
       res.status(400).json({ 
        success: false, 
        error: "Invalid blog ID format" 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete blog",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  } 
};