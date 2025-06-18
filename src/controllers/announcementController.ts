import { Request, Response } from "express";
import Announcement from "../models/announcement";
import { v2 as cloudinary } from 'cloudinary';

interface IFileDictionary {
  [key: string]: Express.Multer.File[];
}

// Helper to safely get file URLs
const getFileUrl = (files: IFileDictionary | undefined, fieldName: string): string | null => {
  if (!files || !files[fieldName] || !files[fieldName][0]) return null;
  return files[fieldName][0].path || null;
};

// Delete file from Cloudinary if needed
const deleteCloudinaryFile = async (url: string | null) => {
  if (!url) return;
  
  try {
    const publicId = url.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error('Error deleting Cloudinary file:', err);
  }
};

export const addAnnouncement = async (req: Request, res: Response) => {
  try {
    const files = req.files as IFileDictionary;
    
    // Sanitize and validate input
    const title = req.body.title?.trim();
    const shortDescription = req.body.shortDescription?.trim();
    const category = req.body.category?.trim();
    const link = req.body.link?.trim();

    if (!title || !shortDescription || !category) {
       res.status(400).json({ 
        success: false, 
        error: "Title, description and category are required" 
      });
      return;
    }

    if (!["announcement", "opportunities"].includes(category)) {
       res.status(400).json({ 
        success: false, 
        error: "Invalid category. Must be 'announcement' or 'opportunities'" 
      });
      return;
    }

    // Get file URLs
    const imageUrl = getFileUrl(files, 'image');
    const videoUrl = getFileUrl(files, 'video');
    const pdfUrl = getFileUrl(files, 'pdf');

    const announcement = await Announcement.create({
      title,
      shortDescription,
      image: imageUrl,
      video: videoUrl,
      pdf: pdfUrl,
      link,
      category
    });

    res.status(201).json({ 
      success: true, 
      data: announcement 
    });
  } catch (err) {
    console.error("Error adding announcement:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create announcement",
      details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    });
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: announcements 
    });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch announcements" 
    });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
       res.status(404).json({ 
        success: false, 
        error: "Announcement not found"  
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: announcement 
    });
  } catch (err) {
    console.error("Error fetching announcement:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch announcement" 
    });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const files = req.files as IFileDictionary;
    const { id } = req.params;
    
    // Get existing announcement
    const existingAnnouncement = await Announcement.findById(id);
    if (!existingAnnouncement) {
       res.status(404).json({ 
        success: false, 
        error: "Announcement not found" 
      });
      return;
    }
    
    // Prepare update data
    const updateData: any = {
      title: req.body.title?.trim() || existingAnnouncement.title,
      shortDescription: req.body.shortDescription?.trim() || existingAnnouncement.shortDescription,
      category: req.body.category?.trim() || existingAnnouncement.category,
      link: req.body.link?.trim() || existingAnnouncement.link,
    };
    
    // Handle file updates
    if (files?.image) {
      await deleteCloudinaryFile(existingAnnouncement.image ?? null);
      updateData.image = getFileUrl(files, 'image');
    }
    
    if (files?.video) {
      await deleteCloudinaryFile(existingAnnouncement.video ?? null);
      updateData.video = getFileUrl(files, 'video');
    }
    
    if (files?.pdf) {
      await deleteCloudinaryFile(existingAnnouncement.pdf ?? null);
      updateData.pdf = getFileUrl(files, 'pdf');
    }
    
    // Validate category if provided
    if (req.body.category && !["announcement", "opportunities"].includes(updateData.category)) {
       res.status(400).json({ 
        success: false, 
        error: "Invalid category" 
      });
      return;
    }
    
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      data: updatedAnnouncement 
    });
  } catch (err) {
    console.error("Error updating announcement:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update announcement" 
    });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
       res.status(404).json({ 
        success: false, 
        error: "Announcement not found" 
      });
      return;
    }
    
    // Delete associated files from Cloudinary
    await Promise.all([
      deleteCloudinaryFile(announcement.image ?? null),
      deleteCloudinaryFile(announcement.video ?? null),
      deleteCloudinaryFile(announcement.pdf ?? null)
    ]);
    
    res.status(200).json({ 
      success: true, 
      message: "Announcement deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete announcement" 
    });
  }
};
export const getAnnouncementsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    // Validate category if provided
    if (category && !["announcement", "opportunities"].includes(category as string)) {
       res.status(400).json({ 
        success: false, 
        error: "Invalid category. Must be 'announcement' or 'opportunities'" 
      });
      return;
    }

    // Build filter
    const filter = category ? { category } : {};
    
    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ 
      success: true, 
      data: announcements 
    });
  } catch (err) {
    console.error("Error fetching announcements by category:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch announcements",
      details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    });
  }
};