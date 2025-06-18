import { Request, Response } from "express";
import Publication from "../models/publication";
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

export const addPublication = async (req: Request, res: Response) => {
  try {
    const files = req.files as IFileDictionary;
    
    // Extract and validate fields
    const { title, shortDescription, category, isOngoing, disclaimer } = req.body;

    if (!title || !shortDescription || !category) {
       res.status(400).json({ 
        success: false, 
        error: "Title, description and category are required" 
      });
      return;
    }

    if (!["Research", "Reports", "Resources"].includes(category)) {
       res.status(400).json({ 
        success: false, 
        error: "Invalid category. Must be 'Research', 'Reports' or 'Resources'" 
      });
      return;
    }

    // Get file URLs from Cloudinary
    const imageUrl = getFileUrl(files, 'image');
    const videoUrl = getFileUrl(files, 'video');
    const pdfUrl = getFileUrl(files, 'pdf');

    const publication = await Publication.create({
      title,
      shortDescription,
      image: imageUrl,
      video: videoUrl,
      pdf: pdfUrl,
      category,
      isOngoing: isOngoing === 'true',
      disclaimer
    });

    res.status(201).json({ 
      success: true, 
      data: publication 
    });
  } catch (err) {
    console.error("Error adding publication:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create publication",
      details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    });
  }
};

export const getPublications = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const publications = await Publication.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: publications 
    });
  } catch (err) {
    console.error("Error fetching publications:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch publications" 
    });
  }
};

export const getPublicationById = async (req: Request, res: Response) => {
  try {
    const publication = await Publication.findById(req.params.id);
    
    if (!publication) {
       res.status(404).json({ 
        success: false, 
        error: "Publication not found" 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: publication 
    });
  } catch (err) {
    console.error("Error fetching publication:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch publication" 
    });
  }
};

export const updatePublication = async (req: Request, res: Response) => {
  try {
    const files = req.files as IFileDictionary;
    const { id } = req.params;
    
    // Get existing publication
    const existingPublication = await Publication.findById(id);
    if (!existingPublication) {
       res.status(404).json({ 
        success: false, 
        error: "Publication not found" 
      });
      return;
    }
    
    // Prepare update data
    const updateData: any = {
      title: req.body.title || existingPublication.title,
      shortDescription: req.body.shortDescription || existingPublication.shortDescription,
      category: req.body.category || existingPublication.category,
      isOngoing: req.body.isOngoing !== undefined 
        ? req.body.isOngoing === 'true' 
        : existingPublication.isOngoing,
      disclaimer: req.body.disclaimer || existingPublication.disclaimer
    };
    
    // Handle file updates
    if (files?.image) {
      await deleteCloudinaryFile(existingPublication.image ?? null);
      updateData.image = getFileUrl(files, 'image');
    }
    
    if (files?.video) {
      await deleteCloudinaryFile(existingPublication.video ?? null);
      updateData.video = getFileUrl(files, 'video');
    }
    
    if (files?.pdf) {
      await deleteCloudinaryFile(existingPublication.pdf ?? null);
      updateData.pdf = getFileUrl(files, 'pdf');
    }
    
    // Validate category if provided
    if (req.body.category && !["Research", "Reports", "Resources"].includes(updateData.category)) {
       res.status(400).json({ 
        success: false, 
        error: "Invalid category" 
      });
      return;
    }
    
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      data: updatedPublication 
    });
  } catch (err) {
    console.error("Error updating publication:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update publication" 
    });
  }
};

export const deletePublication = async (req: Request, res: Response) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    
    if (!publication) {
       res.status(404).json({ 
        success: false, 
        error: "Publication not found" 
      });
      return;
    }
    
    // Delete associated files from Cloudinary
    await Promise.all([
      deleteCloudinaryFile(publication.image ?? null),
      deleteCloudinaryFile(publication.video ?? null),
      deleteCloudinaryFile(publication.pdf ?? null)
    ]);
    
    res.status(200).json({ 
      success: true, 
      message: "Publication deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting publication:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete publication" 
    });
  }
};