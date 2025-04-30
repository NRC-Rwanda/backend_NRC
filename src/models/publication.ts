import mongoose, { Schema, Document } from "mongoose";

export interface IPublication extends Document {
  title: string;
  shortDescription?: string; // Optional
  image?: string; // URL or file path to the image (optional)
  pdf?: string; // URL or file path to the PDF document (optional)
  video?: string; // URL or file path to the video (optional)
  category: string; // "Research", "Reports", "Resources"
  isOngoing?: boolean; // For ongoing research
  disclaimer?: string; // Disclaimer for ongoing research
}

const PublicationSchema: Schema<IPublication> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String }, // Optional image
  pdf: { type: String }, // Optional PDF
  video: { type: String }, // Optional video
  category: { type: String, enum: ["Research", "Reports", "Resources"], required: true },
  isOngoing: { type: Boolean, default: false }, // Default to false
  disclaimer: { type: String }, // Optional disclaimer for ongoing research
});

export default mongoose.model<IPublication>("Publication", PublicationSchema);