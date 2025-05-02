import { Request, Response } from "express";
import Publication from "../models/publication";

// Add a new publication
export const addPublication = async (req: Request, res: Response) => {
  try {
    console.log("Uploaded Files:", req.files); // Debugging: Log uploaded files
    console.log("Request Body:", req.body); // Debugging: Log request body

    // Extract fields from the request body
    const { title, shortDescription, category, isOngoing, disclaimer } = req.body;

    // Validate category
    if (!["Research", "Reports", "Resources"].includes(category)) {
    res.status(400).json({ success: false, error: "Invalid category" });
      return;
    }

    // Extract file paths
    const image = (req.files as any)?.image?.[0]?.filename || null;
    const video = (req.files as any)?.video?.[0]?.filename || null;
    const pdf = (req.files as any)?.pdf?.[0]?.filename || null;

    // Create a new publication
    const publication = await Publication.create({
      title,
      shortDescription,
      image,
      video,
      pdf,
      category,
      isOngoing,
      disclaimer,
    });

    res.status(201).json({ success: true, data: publication });
  } catch (err) {
    console.error("Error adding publication:", err);
    res.status(500).json({ success: false, error: "Failed to add publication" });
  }
};

// Get all publications
export const getPublications = async (req: Request, res: Response) => {
  try {
    const publications = await Publication.find();
    res.status(200).json({ success: true, data: publications });
  } catch (err) {
    console.error("Error fetching publications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch publications" });
  }
};

// Get a publication by ID
export const getPublicationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const publication = await Publication.findById(id);

    if (!publication) {
      res.status(404).json({ success: false, error: "Publication not found" });
      return;
    }

    res.status(200).json({ success: true, data: publication });
  } catch (err) {
    console.error("Error fetching publication by ID:", err);
    res.status(500).json({ success: false, error: "Failed to fetch publication" });
  }
};

// Update a publication
export const updatePublication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    console.log("Uploaded Files:", req.files); // Debugging: Log uploaded files
    console.log("Request Body:", req.body); // Debugging: Log request body

    // Extract fields from the request body
    const { title, shortDescription, category, isOngoing, disclaimer } = req.body;

    // Validate category
    if (category && !["Research", "Reports", "Resources"].includes(category)) {
    res.status(400).json({ success: false, error: "Invalid category" });
      return;
    }

    // Extract file paths
    const image = (req.files as any)?.image?.[0]?.filename || req.body.image || null;
    const video = (req.files as any)?.video?.[0]?.filename || req.body.video || null;
    const pdf = (req.files as any)?.pdf?.[0]?.filename || req.body.pdf || null;

    // Update the publication
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, shortDescription, image, video, pdf, category, isOngoing, disclaimer },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedPublication) {
      res.status(404).json({ success: false, error: "Publication not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedPublication });
  } catch (err) {
    console.error("Error updating publication:", err);
    res.status(500).json({ success: false, error: "Failed to update publication" });
  }
};

// Delete a publication
export const deletePublication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const publication = await Publication.findByIdAndDelete(id);

    if (!publication) {
      res.status(404).json({ success: false, error: "Publication not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Publication deleted" });
  } catch (err) {
    console.error("Error deleting publication:", err);
    res.status(500).json({ success: false, error: "Failed to delete publication" });
  }
};