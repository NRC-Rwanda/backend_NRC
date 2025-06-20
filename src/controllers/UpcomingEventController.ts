import { Request, Response } from "express";
import UpcomingEvent from "../models/UpcomingEvent";
import { v2 as cloudinary } from 'cloudinary';

interface IEventFiles {
  image?: Express.Multer.File[];
  video?: Express.Multer.File[];
  pdf?: Express.Multer.File[];
}

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

export const createUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const files = req.files as IEventFiles;
    const { title, description, eventDate, location, category , applyLink} = req.body;

    // Validate required fields
    if (!title || !eventDate || !location || !category) {
       res.status(400).json({ 
        success: false,
        error: "Title, event date, location and category are required fields" 
      });
      return;
    }

    // Get media URLs from Cloudinary
    const imageUrl = files?.image?.[0]?.path || null;
    const videoUrl = files?.video?.[0]?.path || null;

    const event = new UpcomingEvent({
      title,
      description,
      eventDate,
      location,
      category,
      image: imageUrl,
      video: videoUrl,
      applyLink,
    });

    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to create event",
      details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    });
  }
};

export const getAllUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const { limit, category } = req.query;
    const query = UpcomingEvent.find(category ? { category } : {}).sort({ eventDate: 1 });
    
    if (limit) {
      query.limit(parseInt(limit as string));
    }

    const events = await query.exec();
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch events" 
    });
  }
};

export const getUpcomingEventById = async (req: Request, res: Response) => {
  try {
    const event = await UpcomingEvent.findById(req.params.id);
    
    if (!event) {
       res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch event" 
    });
  }
};

export const updateUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const files = req.files as IEventFiles;
    const { id } = req.params;
    
    // Get existing event
    const existingEvent = await UpcomingEvent.findById(id);
    if (!existingEvent) {
       res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
      return;
    }
    
    // Prepare update data
    const updateData: {
      title: any;
      description: any;
      eventDate: any;
      location: any;
      category: any;
      image?: string | null;
      video?: string | null;
      applyLink?: string | null;
    } = {
      title: req.body.title || existingEvent.title,
      description: req.body.description || existingEvent.description,
      eventDate: req.body.eventDate || existingEvent.eventDate,
      location: req.body.location || existingEvent.location,
      category: req.body.category || existingEvent.category,
      applyLink: req.body.applyLink || existingEvent.applyLink
    };
    
    // Handle media updates
    if (files?.image?.[0]?.path) {
      await deleteCloudinaryFile(existingEvent.image ?? null);
      updateData.image = files.image[0].path;
    }
    if (files?.video?.[0]?.path) {
      await deleteCloudinaryFile(existingEvent.video ?? null);
      updateData.video = files.video[0].path;
    }
   
    
    const updatedEvent = await UpcomingEvent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
     
    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to update event" 
    });
  }
};

export const deleteUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const event = await UpcomingEvent.findByIdAndDelete(req.params.id);
    
    if (!event) {
       res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
      return;
    }
    
    // Delete associated media from Cloudinary
    await Promise.all([
      deleteCloudinaryFile(event.image ?? null),
      deleteCloudinaryFile(event.video ?? null),
    ]);
    
    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete event" 
    });
  }
};

export const getUpcomingEventsByDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    if (!startDate || !endDate) {
       res.status(400).json({ 
        success: false,
        error: "Both startDate and endDate are required" 
      });
      return;
    }
    
    const filter: any = {
      eventDate: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      }
    };
    
    if (category) {
      filter.category = category;
    }
    
    const events = await UpcomingEvent.find(filter).sort({ eventDate: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error("Error fetching events by date:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch events by date range" 
    });
  }
};