import { Request, Response } from "express";
import TeamMember from "../models/team";
import { v2 as cloudinary } from 'cloudinary';


export const addTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, role, shortDescription, category, year } = req.body;

    if (!name || !role || !category) {
      res.status(400).json({ success: false, error: "Name, role and category are required" });
      return;
    }

    const imageFile = req.file;

    const teamMember = await TeamMember.create({
      name: name.trim(),
      role: role.trim(),
      shortDescription,
      category,
      year,
      image: imageFile?.path,
      imagePublicId: imageFile?.filename,
    });

    res.status(201).json({ success: true, data: teamMember });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to add team member" });
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
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404).json({ success: false, error: "Team member not found" });
      return;
    }

    if (req.body.name) member.name = req.body.name;
    if (req.body.role) member.role = req.body.role;
    if (req.body.shortDescription) member.shortDescription = req.body.shortDescription;
    if (req.body.category) member.category = req.body.category;
    if (req.body.year) member.year = req.body.year;

    if (req.file) {
      if (member.imagePublicId) {
        await cloudinary.uploader.destroy(member.imagePublicId);
      }

      member.image = req.file.path;
      member.imagePublicId = req.file.filename;
    }

    await member.save();
    res.json({ success: true, data: member });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update team member" });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404).json({ success: false, error: "Team member not found" });
      return;
    }

    if (member.imagePublicId) {
      await cloudinary.uploader.destroy(member.imagePublicId);
    }

    await member.deleteOne();
    res.json({ success: true, message: "Team member deleted" });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete team member" });
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