"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BlogSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true }, // new
    longDescription: { type: String, required: true }, // new
    video: { type: String },
    pdf: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Blog", BlogSchema);
