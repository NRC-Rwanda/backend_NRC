import { Request, Response } from "express";
import Announcement from "../models/announcement";

// Add a new announcement
export const addAnnouncement = async (req: Request, res: Response) => {
  const { title, shortDescription, image, pdf, link } = req.body;

  try {
    const announcement = await Announcement.create({
      title,
      shortDescription,
      image,
      pdf,
      link,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    console.error("Error adding announcement:", err);
    res.status(500).json({ success: false, error: "Failed to add announcement" });
  }
};

// Get all announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ success: false, error: "Failed to fetch announcements" });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      res.status(404).json({ success: false, error: "Announcement not found" });
    return;
    }

    res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).json({ success: false, error: "Failed to delete announcement" });
  }
};
// Get an announcement by ID
export const getAnnouncementById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const announcement = await Announcement.findById(id);
  
      if (!announcement) {
       res.status(404).json({ success: false, error: "Announcement not found" });
        return;  
    }
  
      res.status(200).json({ success: true, data: announcement });
    } catch (err) {
      console.error("Error fetching announcement by ID:", err);
      res.status(500).json({ success: false, error: "Failed to fetch announcement" });
    }
  };
  
  // Update an announcement
  export const updateAnnouncement = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, shortDescription, image, pdf, link } = req.body;
  
    try {
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id,
        { title, shortDescription, image, pdf, link },
        { new: true, runValidators: true } // Return the updated document and validate fields
      );
  
      if (!updatedAnnouncement) {
       res.status(404).json({ success: false, error: "Announcement not found" });
        return;  
    }
  
      res.status(200).json({ success: true, data: updatedAnnouncement });
    } catch (err) {
      console.error("Error updating announcement:", err);
      res.status(500).json({ success: false, error: "Failed to update announcement" });
    }
  };