"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AnnouncementSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String },
    image: { type: String, required: true },
    pdf: { type: String }, // Optional
    link: { type: String }, // Optional
});
exports.default = mongoose_1.default.model("Announcement", AnnouncementSchema);
