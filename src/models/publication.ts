import mongoose, { Schema, Document } from "mongoose";

export interface IPublication extends Document {
  title: string;
  shortDescription?: string; // Optional short description
  image?: string;
  imagePublicId?: string;

  video?: string;
  videoPublicId?: string;

  pdf?: string;
  pdfPublicId?: string;

  category: "Research" | "Reports" | "Resources"; // Enum for category
  isOngoing?: boolean; // Indicates if the publication is ongoing
  disclaimer?: string; // Optional disclaimer text
}

const PublicationSchema: Schema<IPublication> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
   image: { type: String },
    imagePublicId: { type: String },

    video: { type: String },
    videoPublicId: { type: String },

    pdf: { type: String },
    pdfPublicId: { type: String },
  
    category: { 
      type: String,
      enum: ["Research", "Reports", "Resources"], // Enum for category
      required: true,
    },
    isOngoing: { type: Boolean, default: false }, // Default to false
    disclaimer: { type: String }, // Optional disclaimer
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default mongoose.model<IPublication>("Publication", PublicationSchema);