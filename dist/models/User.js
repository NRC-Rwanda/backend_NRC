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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
// Define the schema
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next(); // Only hash if password is modified
        this.password = yield bcryptjs_1.default.hash(this.password, 10); // Hash the password
        next();
    });
});
// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(candidatePassword, this.password);
    });
};
// Method to generate a reset password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    // Hash the token and set it to the resetPasswordToken field
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // Set the token expiration time (15 minutes)
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
};
exports.default = (0, mongoose_1.model)("User", UserSchema);
