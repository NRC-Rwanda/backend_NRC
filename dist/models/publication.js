"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PublicationSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String },
    image: { type: String }, // Optional image
    pdf: { type: String }, // Optional PDF
    video: { type: String }, // Optional video
    category: { type: String, enum: ["Research", "Reports", "Resources"], required: true },
    isOngoing: { type: Boolean, default: false }, // Default to false
    disclaimer: { type: String }, // Optional disclaimer for ongoing research
});
exports.default = mongoose_1.default.model("Publication", PublicationSchema);
