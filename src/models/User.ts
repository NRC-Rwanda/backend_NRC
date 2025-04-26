// models/User.ts

import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUserMethods {
  getResetPasswordToken(): string;
}

// 1. Extend Document
interface IUser extends Document, IUserMethods {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

// 2. Define schema
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false }, // optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, required: false }, // optional
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// 3. Pre-save password hash
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 4. Method to generate reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default model<IUser>("User", UserSchema);
