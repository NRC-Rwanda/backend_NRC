import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  shortDescription: string; // new
  longDescription: string;  // new
  video?: string;
  pdf?: string;
  image?: string;
  createdAt: Date;
}

const BlogSchema: Schema<IBlog> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true }, // new
  longDescription: { type: String, required: true },  // new
  video: { type: String },
  pdf: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBlog>("Blog", BlogSchema);
