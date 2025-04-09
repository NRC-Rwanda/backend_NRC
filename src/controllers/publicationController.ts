import { Request, Response } from "express";
import Publication from "../models/publication";

// Add a new publication
export const addPublication = async (req: Request, res: Response) => {
  const { title, shortDescription, image, pdf, category, isOngoing, disclaimer } = req.body;

  try {
    const publication = await Publication.create({
      title,
      shortDescription,
      image,
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

// Get publications by category
export const getPublicationsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const publications = await Publication.find({ category });
    res.status(200).json({ success: true, data: publications });
  } catch (err) {
    console.error("Error fetching publications by category:", err);
    res.status(500).json({ success: false, error: "Failed to fetch publications" });
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