import { Request, Response } from "express";
import Publication from "../models/publication";
import { v2 as cloudinary } from 'cloudinary';

interface IFileDictionary {
  [key: string]: Express.Multer.File[];
}

const getFile = (
  files: IFileDictionary | undefined,
  fieldName: string
): Express.Multer.File | null => {
  if (!files || !files[fieldName] || !files[fieldName][0]) return null;
  return files[fieldName][0];
};


export const addPublication = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, category, isOngoing, disclaimer } = req.body;

    if (!title || !shortDescription || !category) {
      res.status(400).json({
        success: false,
        error: "Title, description and category are required",
      });
      return;
    }

    if (!["Research", "Reports", "Resources"].includes(category)) {
      res.status(400).json({
        success: false,
        error: "Invalid category",
      });
      return;
    }

    const files = req.files as IFileDictionary;

    const imageFile = getFile(files, "image");
    const videoFile = getFile(files, "video");
    const pdfFile = getFile(files, "pdf");

    const publication = await Publication.create({
      title,
      shortDescription,
      category,
      isOngoing: isOngoing === "true",
      disclaimer,

      image: imageFile?.path,
      imagePublicId: imageFile?.filename,

      video: videoFile?.path,
      videoPublicId: videoFile?.filename,

      pdf: pdfFile?.path,
      pdfPublicId: pdfFile?.filename,
    });

    res.status(201).json({ success: true, data: publication });
  } catch (err: any) {
    console.error("Error adding publication:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create publication",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
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
    const { id } = req.params;
    const { title, shortDescription, category, isOngoing, disclaimer } = req.body;
    const files = req.files as IFileDictionary;

    const publication = await Publication.findById(id);
    if (!publication) {
      res.status(404).json({ success: false, error: "Publication not found" });
      return;
    }

    // Text updates
    if (title) publication.title = title;
    if (shortDescription) publication.shortDescription = shortDescription;
    if (category) publication.category = category;
    if (isOngoing !== undefined)
      publication.isOngoing = isOngoing === "true";
    if (disclaimer) publication.disclaimer = disclaimer;

    /**
     * ✅ IMAGE UPDATE
     */
    const imageFile = getFile(files, "image");
    if (imageFile) {
      if (
        publication.imagePublicId &&
        publication.imagePublicId !== imageFile.filename
      ) {
        await cloudinary.uploader.destroy(publication.imagePublicId);
      }

      publication.image = imageFile.path;
      publication.imagePublicId = imageFile.filename;
    }

    /**
     * ✅ VIDEO UPDATE
     */
    const videoFile = getFile(files, "video");
    if (videoFile) {
      if (
        publication.videoPublicId &&
        publication.videoPublicId !== videoFile.filename
      ) {
        await cloudinary.uploader.destroy(publication.videoPublicId, {
          resource_type: "video",
        });
      }

      publication.video = videoFile.path;
      publication.videoPublicId = videoFile.filename;
    }

    /**
     * ✅ PDF UPDATE
     */
    const pdfFile = getFile(files, "pdf");
    if (pdfFile) {
      if (
        publication.pdfPublicId &&
        publication.pdfPublicId !== pdfFile.filename
      ) {
        await cloudinary.uploader.destroy(publication.pdfPublicId, {
          resource_type: "raw",
        });
      }

      publication.pdf = pdfFile.path;
      publication.pdfPublicId = pdfFile.filename;
    }

    await publication.save();

    res.status(200).json({ success: true, data: publication });
  } catch (err: any) {
    console.error("Error updating publication:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update publication",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }
};


export const deletePublication = async (req: Request, res: Response) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      res.status(404).json({ success: false, error: "Publication not found" });
      return;
    }

    if (publication.imagePublicId) {
      await cloudinary.uploader.destroy(publication.imagePublicId);
    }

    if (publication.videoPublicId) {
      await cloudinary.uploader.destroy(publication.videoPublicId, {
        resource_type: "video",
      });
    }

    if (publication.pdfPublicId) {
      await cloudinary.uploader.destroy(publication.pdfPublicId, {
        resource_type: "raw",
      });
    }

    await publication.deleteOne();

    res.status(200).json({
      success: true,
      message: "Publication deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting publication:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete publication",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }
};
