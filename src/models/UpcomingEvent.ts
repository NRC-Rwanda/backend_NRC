import mongoose, { Schema, Document } from "mongoose";

export interface IUpcomingEvent extends Document {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  category: string;
  image?: string;    // Cloudinary URL for image
  video?: string;    // Cloudinary URL for video
  pdf?: string;      // Cloudinary URL for PDF
  createdAt: Date;
  updatedAt: Date;
}

const UpcomingEventSchema: Schema<IUpcomingEvent> = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function(value: Date) {
          return value > new Date();
        },
        message: "Event date must be in the future"
      }
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    category: {
  type: String,
  required: true,
  enum: [
    'Conference',
    'Workshop',
    'Community',
    'Entertainment', 
    'Sports',
    'Education',
    'Networking',
    'Exhibition',
    'Seminar',
    'Product Launch'
  ],
  default: 'Workshop' // Optional default
},
    image: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional field
          return /^https?:\/\/res\.cloudinary\.com\/.+\/.+$/.test(v);
        },
        message: "Must be a valid Cloudinary URL"
      }
    },
    video: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional field
          return /^https?:\/\/res\.cloudinary\.com\/.+\/.+$/.test(v);
        },
        message: "Must be a valid Cloudinary URL"
      }
    },
    pdf: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional field
          return /^https?:\/\/res\.cloudinary\.com\/.+\/.+$/.test(v);
        },
        message: "Must be a valid Cloudinary URL"
      }
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Indexes for better performance
UpcomingEventSchema.index({ eventDate: 1 });
UpcomingEventSchema.index({ category: 1 });

export default mongoose.model<IUpcomingEvent>("UpcomingEvent", UpcomingEventSchema);