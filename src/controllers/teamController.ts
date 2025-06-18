import { Request, Response } from "express";
import TeamMember from "../models/team";
import { v2 as cloudinary } from 'cloudinary';

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

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    // Parse and sanitize input
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

    // Get Cloudinary image URL
    const imageUrl = req.file?.path || null;

    const teamMember = await TeamMember.create({
      name,
      role,
      image: imageUrl,
      shortDescription,
      category,
      year,
    });

    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (err) {
    console.error("Error adding team member:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to add team member",
      details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      data: teamMembers 
    });
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch team members" 
    });
  }
};

export const getTeamMemberById = async (req: Request, res: Response) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
       res.status(404).json({ 
        success: false, 
        error: "Team member not found" 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: teamMember 
    });
  } catch (err) {
    console.error("Error fetching team member:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch team member" 
    });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get existing team member
    const existingMember = await TeamMember.findById(id);
    if (!existingMember) {
       res.status(404).json({ 
        success: false, 
        error: "Team member not found" 
      });
      return;
    }
    
    // Prepare update data
    const updateData: any = {
      name: req.body.name?.trim() || existingMember.name,
      role: req.body.role?.trim() || existingMember.role,
      shortDescription: req.body.shortDescription?.trim() || existingMember.shortDescription,
      category: req.body.category?.trim() || existingMember.category,
      year: req.body.year?.trim() || existingMember.year
    };
    
    // Handle image update
    if (req.file?.path) {
      await deleteCloudinaryFile(existingMember.image);
      updateData.image = req.file.path;
    }
    
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      data: updatedMember 
    });
  } catch (err) {
    console.error("Error updating team member:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update team member" 
    });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    
    if (!teamMember) {
       res.status(404).json({ 
        success: false, 
        error: "Team member not found" 
      });
      return;
    }
    
    // Delete associated image from Cloudinary
    await deleteCloudinaryFile(teamMember.image);
    
    res.status(200).json({ 
      success: true, 
      message: "Team member deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete team member" 
    });
  }
};

export const getTeamMembersByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const teamMembers = await TeamMember.find({ category }).sort({ createdAt: -1 });
    
    if (!teamMembers.length) {
       res.status(404).json({ 
        success: false, 
        error: "No team members found for this category" 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: teamMembers 
    });
  } catch (err) {
    console.error("Error fetching team members by category:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch team members by category" 
    });
  }
};