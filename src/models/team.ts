import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  image: string; // URL or file path to the image
  shortDescription?: string; // Optional field
  category: string; // "current" or "alumnae"
  year?: string; // Optional for alumnae team members (e.g., "2023-2024")
}

const TeamMemberSchema: Schema<ITeamMember> = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: String, enum: ["current", "alumnae"], required: true },
  year: { type: String }, // Only for alumnae team members
});

export default mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);