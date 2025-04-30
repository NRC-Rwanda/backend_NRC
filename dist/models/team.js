"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TeamMemberSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: String, enum: ["current", "alumnae"], required: true }, // Ensure these match your expected values
    year: { type: String }, // Optional for alumnae team members
});
exports.default = mongoose_1.default.model("TeamMember", TeamMemberSchema);
