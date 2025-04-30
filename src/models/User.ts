import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Interface for custom methods
interface IUserMethods {
  getResetPasswordToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Extend Document with IUser fields and methods
interface IUser extends Document, IUserMethods {
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  status?: string; // Allow custom strings for status
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

// Define the schema
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true }, // Made required
  lastName: { type: String, required: false }, // Optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Exclude password by default
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, required: false }, // Allow any string for status
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

// Pre-save middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a reset password token
UserSchema.methods.getResetPasswordToken = function (): string {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the token expiration time (15 minutes)
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};

export default model<IUser>("User", UserSchema);