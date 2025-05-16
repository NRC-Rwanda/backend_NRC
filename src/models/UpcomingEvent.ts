import mongoose, { Schema, Document } from "mongoose";

export interface IUpcomingEvent extends Document {
  title: string;
  shortDescription?: string;
  image?: string;
  video?: string;
  displayOnHomepage: boolean;
  pdf?: string;
  link?: string;
  eventDate: Date; // Specific for events
}

const UpcomingEventSchema: Schema<IUpcomingEvent> = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String },
  video: { type: String },
  displayOnHomepage: { type: Boolean, default: false },
  pdf: { type: String },
  link: { type: String },
  eventDate: { type: Date, required: true },
});

export default mongoose.model<IUpcomingEvent>("UpcomingEvent", UpcomingEventSchema);
