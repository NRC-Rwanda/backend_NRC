import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  image?: string;
  imagePublicId?: string;
  shortDescription?: string; // Optional field
  category: string; // "current" or "alumnae" 
  year?: string; // Optional for alumnae team membersy
} 

const TeamMemberSchema: Schema<ITeamMember> = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: String, enum: ["current", "alumnae"], required: true }, // Ensure these match your expected values
  year: { type: String }, // Optional for alumnae team members
});

export default mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);