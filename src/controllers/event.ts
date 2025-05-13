// src/controllers/eventController.ts
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import { Event } from '../models/UpcomingEvent';

const events: Event[] = [];

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, link } = req.body;
    let imageUrl, videoUrl;

    if (req.files) {
      const files = req.files as {
        image?: Express.Multer.File[];
        video?: Express.Multer.File[];
      };

      // Upload image
      if (files.image && files.image[0]) {
        const result = await cloudinary.uploader.upload(files.image[0].path, {
          folder: 'events/images',
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(files.image[0].path); // remove local file
      }

      // Upload video
      if (files.video && files.video[0]) {
        const result = await cloudinary.uploader.upload(files.video[0].path, {
          resource_type: 'video',
          folder: 'events/videos',
        });
        videoUrl = result.secure_url;
        fs.unlinkSync(files.video[0].path);
      }
    }

    const newEvent: Event = {
      title,
      shortDescription,
      imageUrl,
      videoUrl,
      link,
    };

    events.push(newEvent);

     res.status(201).json({ message: 'Event created', event: newEvent });
     return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    return;
  }
};
