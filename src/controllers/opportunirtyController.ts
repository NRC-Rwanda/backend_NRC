import { Request, Response } from "express";
import Opportunity from "../models/opportunity";

// Add a new opportunity
export const addOpportunity = async (req: Request, res: Response) => {
  const { title, shortDescription, image, link } = req.body;

  try {
    const opportunity = await Opportunity.create({
      title,
      shortDescription,
      image,
      link,
    });

    res.status(201).json({ success: true, data: opportunity });
  } catch (err) {
    console.error("Error adding opportunity:", err);
    res.status(500).json({ success: false, error: "Failed to add opportunity" });
  }
};

// Get all opportunities
export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const opportunities = await Opportunity.find();
    res.status(200).json({ success: true, data: opportunities });
  } catch (err) {
    console.error("Error fetching opportunities:", err);
    res.status(500).json({ success: false, error: "Failed to fetch opportunities" });
  }
};

// Delete an opportunity
export const deleteOpportunity = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const opportunity = await Opportunity.findByIdAndDelete(id);

    if (!opportunity) {
      res.status(404).json({ success: false, error: "Opportunity not found" });
        return; 
    }

    res.status(200).json({ success: true, message: "Opportunity deleted" });
  } catch (err) {
    console.error("Error deleting opportunity:", err);
    res.status(500).json({ success: false, error: "Failed to delete opportunity" });
  }
  
};
// Get an opportunity by ID
export const getOpportunityById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const opportunity = await Opportunity.findById(id);
  
      if (!opportunity) {
        res.status(404).json({ success: false, error: "Opportunity not found" });
        return;  
    }
  
      res.status(200).json({ success: true, data: opportunity });
    } catch (err) {
      console.error("Error fetching opportunity by ID:", err);
      res.status(500).json({ success: false, error: "Failed to fetch opportunity" });
    }
  };
  
  // Update an opportunity
  export const updateOpportunity = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, shortDescription, image, link } = req.body;
  
    try {
      const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        id,
        { title, shortDescription, image, link },
        { new: true, runValidators: true } // Return the updated document and validate fields
      );
  
      if (!updatedOpportunity) {
        res.status(404).json({ success: false, error: "Opportunity not found" });
        return;  
    }
  
      res.status(200).json({ success: true, data: updatedOpportunity });
    } catch (err) {
      console.error("Error updating opportunity:", err);
      res.status(500).json({ success: false, error: "Failed to update opportunity" });
    }
  };