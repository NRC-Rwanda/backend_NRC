import { Request, Response } from "express";
import TeamMember from "../models/team";

// Add a new team member
export const addTeamMember = async (req: Request, res: Response) => {
  try {
    // Parse and trim the request body fields
    const name = req.body.name?.trim().replace(/^"|"$/g, "");
    const role = req.body.role?.trim().replace(/^"|"$/g, "");
    const shortDescription = req.body.shortDescription?.trim().replace(/^"|"$/g, "");
    const category = req.body.category?.trim().replace(/^"|"$/g, "");
    const year = req.body.year?.trim().replace(/^"|"$/g, "");

    // Validate required fields
    if (!name || !role || !category) {
      res.status(400).json({
        success: false,
        error: "Name, role, and category are required fields.",
      });
      return;
    }

    const image = req.file?.filename || ""; // Get the uploaded file's name

    const teamMember = await TeamMember.create({
      name,
      role,
      image: `/uploads/${image}`, // Save the file path
      shortDescription,
      category,
      year,
    });

    const host = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      success: true,
      data: {
        ...teamMember.toJSON(),
        imageUrl: image ? `${host}/uploads/${image}` : null,
      },
    });
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

// Get a team member by ID
export const getTeamMemberById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      res.status(404).json({ success: false, error: "Team member not found" });
      return;
    }

    res.status(200).json({ success: true, data: teamMember });
  } catch (err) {
    console.error("Error fetching team member by ID:", err);
    res.status(500).json({ success: false, error: "Failed to fetch team member" });
  }
};

// Update a team member
export const updateTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, shortDescription, category, year } = req.body;

  try {
    const image = req.file?.filename || ""; // Get the uploaded file's name

    // Build the update object
    const updateData: any = {
      name,
      role,
      shortDescription,
      category,
      year,
    };

    if (image) updateData.image = `/uploads/${image}`;

    // Find the team member by ID and update their details
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated fields
    });

    if (!updatedTeamMember) {
      res.status(404).json({ success: false, error: "Team member not found" });
      return;
    }

    const host = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      data: {
        ...updatedTeamMember.toJSON(),
        imageUrl: updatedTeamMember.image ? `${host}${updatedTeamMember.image}` : null,
      },
    });
  } catch (err) {
    console.error("Error updating team member:", err);
    res.status(500).json({ success: false, error: "Failed to update team member" });
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
};
export const getTeamMembersByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const teamMembers = await TeamMember.find({ category });

    if (!teamMembers || teamMembers.length === 0) {
      res.status(404).json({ success: false, error: "No team members found for this category" });
      return;
    }

    res.status(200).json({ success: true, data: teamMembers });
  } catch (err) {
    console.error("Error fetching team members by category:", err);
    res.status(500).json({ success: false, error: "Failed to fetch team members by category" });
  }
};