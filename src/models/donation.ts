import { Schema, model, Document } from 'mongoose';

interface IDonation extends Document {
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  contactOk: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  iremboTransactionId?: string; // Track IremboPay transaction
}

const DonationSchema = new Schema<IDonation>({
  amount: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  contactOk: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  iremboTransactionId: { type: String } // Stores IremboPay's transaction ID
}, { timestamps: true });

export const Donation = model<IDonation>('Donation', DonationSchema);