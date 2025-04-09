import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  video?: string; // Optional video URL
  pdf?: string; // Optional PDF document URL
  image?: string; // Optional image URL
  createdAt: Date;
}

const BlogSchema: Schema<IBlog> = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  video: { type: String }, // Optional field for video URL
  pdf: { type: String }, // Optional field for PDF document URL
  image: { type: String }, // Optional field for image URL
  createdAt: { type: Date, default: Date.now }, // Automatically set the creation date
});

export default mongoose.model<IBlog>("Blog", BlogSchema);