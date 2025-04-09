import { Schema, model,Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 

interface IUserMethods {
    getResetPasswordToken(): string;
  }
  
  // 2. Combine with Document interface
  interface IUser extends Document, IUserMethods {
    name: string;
    email: string;
    role: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
  }

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  
    return resetToken;
  };
export default model<IUser>("User", UserSchema);