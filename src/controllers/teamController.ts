import { Request, Response } from "express";
import TeamMember from "../models/team";

// Add a new team member
export const addTeamMember = async (req: Request, res: Response) => {
  const { name, role, image, shortDescription, category, year } = req.body;

  try {
    const teamMember = await TeamMember.create({
      name,
      role,
      image,
      shortDescription,
      category,
      year,
    });

    res.status(201).json({ success: true, data: teamMember });
  } catch (err) {
    console.error("Error adding team member:", err);
    res.status(500).json({ success: false, error: "Failed to add team member" });
  }
};

// Get all team members
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ success: true, data: teamMembers });
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ success: false, error: "Failed to fetch team members" });
  }
};

// Get team members by category
export const getTeamMembersByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const teamMembers = await TeamMember.find({ category });
    res.status(200).json({ success: true, data: teamMembers });
  } catch (err) {
    console.error("Error fetching team members by category:", err);
    res.status(500).json({ success: false, error: "Failed to fetch team members" });
  }
};

// Delete a team member
export const deleteTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      res.status(404).json({ success: false, error: "Team member not found" });
        return; 
    }

    res.status(200).json({ success: true, message: "Team member deleted" });
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ success: false, error: "Failed to delete team member" });
  }
};export const updateTeamMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, role, image, shortDescription, category, year } = req.body;
  
    try {
      // Find the team member by ID and update their details
      const updatedTeamMember = await TeamMember.findByIdAndUpdate(
        id,
        { name, role, image, shortDescription, category, year },
        { new: true, runValidators: true } // Return the updated document and validate the fields
      );
  
      if (!updatedTeamMember) {
        res.status(404).json({ success: false, error: "Team member not found" });
        return; 
      }
  
      res.status(200).json({ success: true, data: updatedTeamMember });
    } catch (err) {
      console.error("Error updating team member:", err);
      res.status(500).json({ success: false, error: "Failed to update team member" });
    }
  };