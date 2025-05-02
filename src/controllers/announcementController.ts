import { Request, Response } from "express";
import Announcement from "../models/announcement";

// Add a new announcement

export const addAnnouncement = async (req: Request, res: Response) => {
  try {
    console.log("Uploaded Files:", req.files); // Debugging: Log uploaded files
    console.log("Request Body:", req.body); // Debugging: Log request body

    // Sanitize the request body
    const title = req.body.title?.replace(/['"]+/g, ""); // Remove extra quotes
    const shortDescription = req.body.shortDescription?.replace(/['"]+/g, "");
    const category = req.body.category?.replace(/['"]+/g, "");
    const link = req.body.link?.replace(/['"]+/g, ""); // Sanitize the link


    // Validate category
    if (!["announcement", "opportunities"].includes(category)) {
       res.status(400).json({ success: false, error: "Invalid category" });
      return;
    }

    // Extract file paths
    const image = (req.files as any)?.image?.[0]?.filename || null;
    const video = (req.files as any)?.video?.[0]?.filename || null;
    const pdf = (req.files as any)?.pdf?.[0]?.filename || null;

    // Create a new announcement
    const announcement = await Announcement.create({
      title,
      shortDescription,
      image,
      video,
      pdf,
      link,
      category,
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
  
    try {
      console.log("Uploaded Files:", req.files); // Debugging: Log uploaded files
      console.log("Request Body:", req.body); // Debugging: Log request body
  
      // Sanitize the request body
      const title = req.body.title?.replace(/['"]+/g, ""); // Remove extra quotes
      const shortDescription = req.body.shortDescription?.replace(/['"]+/g, "");
      const category = req.body.category?.replace(/['"]+/g, "");
      const link = req.body.link?.replace(/['"]+/g, ""); // Sanitize the link

  
      // Validate category
      if (category && !["announcement", "opportunities"].includes(category)) {
        res.status(400).json({ success: false, error: "Invalid category" });
        return;
      }
  
      // Extract file paths
      const image = (req.files as any)?.image?.[0]?.filename || req.body.image || null;
      const video = (req.files as any)?.video?.[0]?.filename || req.body.video || null;
      const pdf = (req.files as any)?.pdf?.[0]?.filename || req.body.pdf || null;
  
      // Update the announcement
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id, 
        { title, shortDescription, image, video, pdf,link, category },
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
  export const getAnnouncementsByCategory = async (req: Request, res: Response) => {
    const { category } = req.query;
  
    try {
      const filter = category ? { category } : {};
      const announcements = await Announcement.find(filter);
  
      res.status(200).json({ success: true, data: announcements });
    } catch (err) {
      console.error("Error fetching announcements:", err);
      res.status(500).json({ success: false, error: "Failed to fetch announcements" });
    }
  };