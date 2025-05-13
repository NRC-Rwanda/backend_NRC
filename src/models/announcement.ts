import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  shortDescription?: string; // Optional
  image?: string; // Optional URL or file path to the image
  video?: string;
  displayOnHomepage: boolean;
 // Optional URL or file path to the video
  pdf?: string; // Optional URL or file path to the PDF document
  link?: string; // Optional link for the announcement
  category: "announcement" | "opportunities"; // Enum for category
}

const AnnouncementSchema: Schema<IAnnouncement> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String }, // Optional 
  video: { type: String }, // Optional
  displayOnHomepage: { type: Boolean, default: false },
  pdf: { type: String }, // Optional
  link: { type: String }, // Optional
  category: { type: String, enum: ["announcement", "opportunities"], required: true }, // Enum
});

export default mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);