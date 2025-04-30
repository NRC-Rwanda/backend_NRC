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
exports.updateAnnouncement = exports.getAnnouncementById = exports.deleteAnnouncement = exports.getAnnouncements = exports.addAnnouncement = void 0;
const announcement_1 = __importDefault(require("../models/announcement"));
// Add a new announcement
const addAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, image, pdf, link } = req.body;
    try {
        const announcement = yield announcement_1.default.create({
            title,
            shortDescription,
            image,
            pdf,
            link,
        });
        res.status(201).json({ success: true, data: announcement });
    }
    catch (err) {
        console.error("Error adding announcement:", err);
        res.status(500).json({ success: false, error: "Failed to add announcement" });
    }
});
exports.addAnnouncement = addAnnouncement;
// Get all announcements
const getAnnouncements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcements = yield announcement_1.default.find();
        res.status(200).json({ success: true, data: announcements });
    }
    catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({ success: false, error: "Failed to fetch announcements" });
    }
});
exports.getAnnouncements = getAnnouncements;
// Delete an announcement
const deleteAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const announcement = yield announcement_1.default.findByIdAndDelete(id);
        if (!announcement) {
            res.status(404).json({ success: false, error: "Announcement not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Announcement deleted" });
    }
    catch (err) {
        console.error("Error deleting announcement:", err);
        res.status(500).json({ success: false, error: "Failed to delete announcement" });
    }
});
exports.deleteAnnouncement = deleteAnnouncement;
// Get an announcement by ID
const getAnnouncementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const announcement = yield announcement_1.default.findById(id);
        if (!announcement) {
            res.status(404).json({ success: false, error: "Announcement not found" });
            return;
        }
        res.status(200).json({ success: true, data: announcement });
    }
    catch (err) {
        console.error("Error fetching announcement by ID:", err);
        res.status(500).json({ success: false, error: "Failed to fetch announcement" });
    }
});
exports.getAnnouncementById = getAnnouncementById;
// Update an announcement
const updateAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, shortDescription, image, pdf, link } = req.body;
    try {
        const updatedAnnouncement = yield announcement_1.default.findByIdAndUpdate(id, { title, shortDescription, image, pdf, link }, { new: true, runValidators: true } // Return the updated document and validate fields
        );
        if (!updatedAnnouncement) {
            res.status(404).json({ success: false, error: "Announcement not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedAnnouncement });
    }
    catch (err) {
        console.error("Error updating announcement:", err);
        res.status(500).json({ success: false, error: "Failed to update announcement" });
    }
});
exports.updateAnnouncement = updateAnnouncement;
