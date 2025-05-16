import { Request, Response } from "express";
import UpcomingEvent from "../models/UpcomingEvent";

export const createUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const event = new UpcomingEvent(req.body);
    await event.save();
    res.status(201).json(event);
  
  } catch (err) {
    res.status(400).json({ error: "Failed to create event", details: err });
  }
};

export const getAllUpcomingEvents = async (_req: Request, res: Response) => {
  try {
    const events = await UpcomingEvent.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getUpcomingEventById = async (req: Request, res: Response) => {
  try {
    const event = await UpcomingEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const updateUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const updated = await UpcomingEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
    return;
  } catch (err) {
    res.status(400).json({ error: "Failed to update event" });
  }
};

export const deleteUpcomingEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await UpcomingEvent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
export const getUpcomingEventsByDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const events = await UpcomingEvent.find({
      eventDate: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    }).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
