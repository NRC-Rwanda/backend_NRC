import { Request, Response } from "express";
import Announcement from "../models/announcement";
import { v2 as cloudinary } from "cloudinary";

interface IFileDictionary {
  [key: string]: Express.Multer.File[];
}

// Helper to safely get uploaded file
const getFile = (
  files: IFileDictionary | undefined,
  fieldName: string
): Express.Multer.File | null => {
  if (!files || !files[fieldName] || !files[fieldName][0]) return null;
  return files[fieldName][0];
};

/**
 * ============================
 * CREATE ANNOUNCEMENT
 * ============================
 */
export const addAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, category, link } = req.body;

    if (!title || !shortDescription || !category) {
      res.status(400).json({
        success: false,
        error: "Title, short description and category are required",
      });
      return;
    }

    if (!["announcement", "opportunities"].includes(category)) {
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

    const announcement = await Announcement.create({
      title,
      shortDescription,
      category,
      link,

      image: imageFile?.path,
      imagePublicId: imageFile?.filename,

      video: videoFile?.path,
      videoPublicId: videoFile?.filename,

      pdf: pdfFile?.path,
      pdfPublicId: pdfFile?.filename,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    console.error("Add announcement error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create announcement",
    });
  }
};

/**
 * ============================
 * GET ALL ANNOUNCEMENTS
 * ============================
 */
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const announcements = await Announcement.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch announcements",
    });
  }
};

/**
 * ============================
 * GET ANNOUNCEMENT BY ID
 * ============================
 */
export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      res.status(404).json({
        success: false,
        error: "Announcement not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch announcement",
    });
  }
};

/**
 * ============================
 * UPDATE ANNOUNCEMENT (SAFE)
 * ============================
 */
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const files = req.files as IFileDictionary;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      res.status(404).json({
        success: false,
        error: "Announcement not found",
      });
      return;
    }

    // TEXT FIELDS
    if (req.body.title) announcement.title = req.body.title;
    if (req.body.shortDescription)
      announcement.shortDescription = req.body.shortDescription;
    if (req.body.category) announcement.category = req.body.category;
    if (req.body.link !== undefined) announcement.link = req.body.link;

    /**
     * IMAGE UPDATE (SAFE)
     */
    const imageFile = getFile(files, "image");
    if (imageFile) {
      if (
        announcement.imagePublicId &&
        announcement.imagePublicId !== imageFile.filename
      ) {
        await cloudinary.uploader.destroy(announcement.imagePublicId);
      }

      announcement.image = imageFile.path;
      announcement.imagePublicId = imageFile.filename;
    }

    /**
     * VIDEO UPDATE (SAFE)
     */
    const videoFile = getFile(files, "video");
    if (videoFile) {
      if (
        announcement.videoPublicId &&
        announcement.videoPublicId !== videoFile.filename
      ) {
        await cloudinary.uploader.destroy(
          announcement.videoPublicId,
          { resource_type: "video" }
        );
      }

      announcement.video = videoFile.path;
      announcement.videoPublicId = videoFile.filename;
    }

    /**
     * PDF UPDATE (SAFE)
     */
    const pdfFile = getFile(files, "pdf");
    if (pdfFile) {
      if (
        announcement.pdfPublicId &&
        announcement.pdfPublicId !== pdfFile.filename
      ) {
        await cloudinary.uploader.destroy(
          announcement.pdfPublicId,
          { resource_type: "raw" }
        );
      }

      announcement.pdf = pdfFile.path;
      announcement.pdfPublicId = pdfFile.filename;
    }

    await announcement.save();

    res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    console.error("Update announcement error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update announcement",
    });
  }
};

/**
 * ============================
 * DELETE ANNOUNCEMENT (SAFE)
 * ============================
 */
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      res.status(404).json({
        success: false,
        error: "Announcement not found",
      });
      return;
    }

    if (announcement.imagePublicId) {
      await cloudinary.uploader.destroy(announcement.imagePublicId);
    }

    if (announcement.videoPublicId) {
      await cloudinary.uploader.destroy(
        announcement.videoPublicId,
        { resource_type: "video" }
      );
    }

    if (announcement.pdfPublicId) {
      await cloudinary.uploader.destroy(
        announcement.pdfPublicId,
        { resource_type: "raw" }
      );
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete announcement",
    });
  }
};
export const getAnnouncementsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { category } = req.query;

    if (!category || !["announcement", "opportunities"].includes(category as string)) {
      res.status(400).json({
        success: false,
        error: "Invalid category",
      });
      return;
    }

    const announcements = await Announcement.find({ category }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    console.error("Get announcements by category error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch announcements by category",
    });
  }
};
