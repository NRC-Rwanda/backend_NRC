import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  shortDescription?: string; // Optional
  image: string; // URL or file path to the image
  pdf?: string; // Optional URL or file path to the PDF document
  link?: string; // Optional link for the announcement
}

const AnnouncementSchema: Schema<IAnnouncement> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String, required: true },
  pdf: { type: String }, // Optional
  link: { type: String }, // Optional
});

export default mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);