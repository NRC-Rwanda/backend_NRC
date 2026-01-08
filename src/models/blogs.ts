import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  shortDescription: string; // new
  longDescription: string;  // new
  image?: string;
  imagePublicId?: string;

  video?: string;
  videoPublicId?: string;

  pdf?: string;
  pdfPublicId?: string;

  createdAt: Date;
}

const BlogSchema: Schema<IBlog> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true }, // new
  longDescription: { type: String, required: true },  // new
 image: { type: String },
  imagePublicId: { type: String },

  video: { type: String },
  videoPublicId: { type: String },

  pdf: { type: String },
  pdfPublicId: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBlog>("Blog", BlogSchema);
