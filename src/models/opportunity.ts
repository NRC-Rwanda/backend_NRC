import mongoose, { Schema, Document } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  shortDescription?: string; // Optional
  image: string; // URL or file path to the image
  link: string; // Required link for the opportunity
}

const OpportunitySchema: Schema<IOpportunity> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

export default mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);