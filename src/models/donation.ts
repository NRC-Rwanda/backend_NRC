import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  address: string;
  contactOk: boolean;
  city: string;
  country: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema<IDonation> = new mongoose.Schema(
  {
    amount: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String },
    address: { type: String, required: true },
    contactOk: { type: Boolean, default: false },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IDonation>("Donation", DonationSchema);