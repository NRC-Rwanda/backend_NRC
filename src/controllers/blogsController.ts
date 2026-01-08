import { Request, Response } from "express";
import Blog from "../models/blogs";
import { v2 as cloudinary } from "cloudinary";

interface IFileDictionary {
  [key: string]: Express.Multer.File[];
}

// Helper function to safely access files
const getFile = (
  files: IFileDictionary | undefined,
  fieldName: string
): Express.Multer.File | null => {
  if (!files || !files[fieldName] || !files[fieldName][0]) return null;
  return files[fieldName][0];
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
    const videoFile = getFile(files, 'video');
    const pdfFile = getFile(files, 'pdf');
    const imageFile = getFile(files, 'image');

    const blog = await Blog.create({
      title,
      shortDescription,
      longDescription,
      image: imageFile?.path,
      imagePublicId: imageFile?.filename,

      video: videoFile?.path,
      videoPublicId: videoFile?.filename,

      pdf: pdfFile?.path,
      pdfPublicId: pdfFile?.filename,

    });

    res.status(201).json({
      success: true,
      data: {
        id: blog._id,
        title: blog.title,
        shortDescription: blog.shortDescription,
        longDescription: blog.longDescription,
        videoFile: videoFile || null,
        pdfFile: pdfFile || null,
        imageFile: imageFile || null,
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

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, error: "Blog not found" });
      return;
    }

    // ✅ Update text fields
    if (title) blog.title = title;
    if (shortDescription) blog.shortDescription = shortDescription;
    if (longDescription) blog.longDescription = longDescription;

    /**
     * ✅ IMAGE UPDATE (SAFE)
     */
    const imageFile = getFile(files, "image");
    if (imageFile) {
      const newImagePublicId = imageFile.filename;
      const newImagePath = imageFile.path;

      // delete old image AFTER new one exists
      if (blog.imagePublicId && blog.imagePublicId !== newImagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      blog.image = newImagePath;
      blog.imagePublicId = newImagePublicId;
    }

    /**
     * ✅ VIDEO UPDATE (SAFE)
     */
    const videoFile = getFile(files, "video");
    if (videoFile) {
      const newVideoPublicId = videoFile.filename;
      const newVideoPath = videoFile.path;

      if (blog.videoPublicId && blog.videoPublicId !== newVideoPublicId) {
        await cloudinary.uploader.destroy(blog.videoPublicId, {
          resource_type: "video",
        });
      }

      blog.video = newVideoPath;
      blog.videoPublicId = newVideoPublicId;
    }

    /**
     * ✅ PDF UPDATE (SAFE)
     */
    const pdfFile = getFile(files, "pdf");
    if (pdfFile) {
      const newPdfPublicId = pdfFile.filename;
      const newPdfPath = pdfFile.path;

      if (blog.pdfPublicId && blog.pdfPublicId !== newPdfPublicId) {
        await cloudinary.uploader.destroy(blog.pdfPublicId, {
          resource_type: "raw",
        });
      }

      blog.pdf = newPdfPath;
      blog.pdfPublicId = newPdfPublicId;
    }

    await blog.save();

    res.status(200).json({ success: true, data: blog });
    return;
  } catch (err: any) {
    console.error("Update blog error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update blog",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
    return;
  }
};





// Delete a blog with error handling
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, error: "Blog not found" });
      return;
    }

    // Delete files from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    if (blog.videoPublicId) {
      await cloudinary.uploader.destroy(blog.videoPublicId, {
        resource_type: "video",
      });
    }

    if (blog.pdfPublicId) {
      await cloudinary.uploader.destroy(blog.pdfPublicId);
    }

    // Delete blog from DB
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err: any) {
    console.error("Delete blog error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete blog",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }
};
