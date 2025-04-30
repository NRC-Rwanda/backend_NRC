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
exports.deletePublication = exports.getPublicationsByCategory = exports.getPublications = exports.addPublication = void 0;
const publication_1 = __importDefault(require("../models/publication"));
const addPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        console.log("Uploaded Files:", req.files); // Debugging: Log uploaded files
        console.log("Request Body:", req.body); // Debugging: Log request body
        const { title, shortDescription, category, isOngoing, disclaimer } = req.body;
        // Get file paths from the uploaded files
        const video = ((_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.filename) || null;
        const pdf = ((_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.pdf) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename) || null;
        const image = ((_j = (_h = (_g = req.files) === null || _g === void 0 ? void 0 : _g.image) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.filename) || null;
        // Create a new publication
        const publication = yield publication_1.default.create({
            title,
            shortDescription,
            category,
            isOngoing,
            disclaimer,
            video,
            pdf,
            image,
        });
        res.status(201).json({ success: true, data: publication });
    }
    catch (err) {
        console.error("Error adding publication:", err);
        res.status(500).json({ success: false, error: "Failed to add publication" });
    }
});
exports.addPublication = addPublication;
// Get all publications
const getPublications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publications = yield publication_1.default.find();
        res.status(200).json({ success: true, data: publications });
    }
    catch (err) {
        console.error("Error fetching publications:", err);
        res.status(500).json({ success: false, error: "Failed to fetch publications" });
    }
});
exports.getPublications = getPublications;
// Get publications by category
const getPublicationsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const publications = yield publication_1.default.find({ category });
        res.status(200).json({ success: true, data: publications });
    }
    catch (err) {
        console.error("Error fetching publications by category:", err);
        res.status(500).json({ success: false, error: "Failed to fetch publications" });
    }
});
exports.getPublicationsByCategory = getPublicationsByCategory;
// Delete a publication
const deletePublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const publication = yield publication_1.default.findByIdAndDelete(id);
        if (!publication) {
            res.status(404).json({ success: false, error: "Publication not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Publication deleted" });
    }
    catch (err) {
        console.error("Error deleting publication:", err);
        res.status(500).json({ success: false, error: "Failed to delete publication" });
    }
});
exports.deletePublication = deletePublication;
