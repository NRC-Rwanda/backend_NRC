import { Request, Response,RequestHandler } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail"; // We'll implement this next


// Register User
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName,status ,email, password, role = "user" } = req.body; // Default role to "user"
  try {
    console.log("Request Body:", req.body);

    // Create the user with the optional role
    const user = await User.create({ firstName, lastName,status, email, password, role });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.JWT_EXPIRE!, 10),
    });

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};
 
// Login User 
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Find the user by email and include the password in the query
    const user = await User.findOne({ email }).select("+password");

    // Check if the user exists and the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    // Generate a JWT token with the user's role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.JWT_EXPIRE!, 10),
    });

    // Include the role in the response
    
    res.status(200).json({ success: true, token, role: user.role });
    console.log(user.role)
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};
// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Click the link below:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({ success: false, error: "Email could not be sent" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Reset Password
export const resetPassword: RequestHandler = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Check if both passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ success: false, error: "Passwords do not match" });
      return;
    }

    // Hash the token and find the user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      res.status(400).json({ success: false, error: "Invalid or expired token" });
      return;
    }

    // Update the user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ success: false, error: "Failed to reset password" });
  }
};
