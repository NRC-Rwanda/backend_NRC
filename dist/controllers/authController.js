"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, status, email, password, role = "user" } = req.body; // Default role to "user"
    try {
        console.log("Request Body:", req.body);
        // Validate required fields
        if (!firstName || !email || !password) {
            res.status(400).json({
                success: false,
                error: "First name, email, and password are required fields.",
            });
            return;
        }
        // Create the user
        const user = yield User_1.default.create({ firstName, lastName, status, email, password, role });
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
        });
        res.status(201).json({ success: true, token });
    }
    catch (err) {
        console.error("Error in register:", err);
        // Handle duplicate email error
        if (err.code === 11000) {
            res.status(400).json({ success: false, error: "Email already exists" });
            return;
        }
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email and include the password in the query
        const user = yield User_1.default.findOne({ email }).select("+password");
        // Check if the user exists and the password matches
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ success: false, error: "Invalid credentials" });
            return;
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
        });
        res.status(200).json({ success: true, token, role: user.role });
    }
    catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ success: false, error: "Login failed" });
    }
});
exports.login = login;
// Forgot Password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        yield user.save({ validateBeforeSave: false });
        // Send email
        const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
        const message = `You are receiving this email because you requested a password reset. Click the link below:\n\n${resetUrl}`;
        try {
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });
            res.status(200).json({ success: true, message: "Email sent" });
        }
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            yield user.save({ validateBeforeSave: false });
            res.status(500).json({ success: false, error: "Email could not be sent" });
        }
    }
    catch (err) {
        console.error("Error in forgotPassword:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.forgotPassword = forgotPassword;
// Reset Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        // Check if both passwords match
        if (password !== confirmPassword) {
            res.status(400).json({ success: false, error: "Passwords do not match" });
            return;
        }
        // Hash the token and find the user
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = yield User_1.default.findOne({
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
        yield user.save();
        res.status(200).json({ success: true, message: "Password reset successful" });
    }
    catch (err) {
        console.error("Error in resetPassword:", err);
        res.status(500).json({ success: false, error: "Failed to reset password" });
    }
});
exports.resetPassword = resetPassword;
// Get All Users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find(); // Fetch all users
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, error: "Failed to fetch users" });
    }
});
exports.getUsers = getUsers;
// Get User by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id); // Fetch user by ID
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
});
exports.getUserById = getUserById;
// Update User
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName, email, status, role } = req.body;
    try {
        // Build the update object
        const updateData = {
            firstName,
            lastName,
            email,
            status,
            role,
        };
        // Find the user by ID and update their details
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated fields
        });
        if (!updatedUser) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ success: false, error: "Failed to update user" });
    }
});
exports.updateUser = updateUser;
// Delete User
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.status(200).json({ success: true, message: "User deleted" });
    }
    catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ success: false, error: "Failed to delete user" });
    }
});
exports.deleteUser = deleteUser;
