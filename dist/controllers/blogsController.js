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
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getBlogs = exports.addBlog = void 0;
const blogs_1 = __importDefault(require("../models/blogs"));
const addBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const { title, shortDescription, longDescription } = req.body;
        const video = ((_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.filename) || "";
        const pdf = ((_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.pdf) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename) || "";
        const image = ((_j = (_h = (_g = req.files) === null || _g === void 0 ? void 0 : _g.image) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.filename) || "";
        const blog = yield blogs_1.default.create({
            title,
            shortDescription,
            longDescription,
            video,
            pdf,
            image,
        });
        const host = `${req.protocol}://${req.get("host")}`;
        res.status(201).json({
            success: true,
            data: Object.assign(Object.assign({}, blog.toJSON()), { videoUrl: video ? `${host}/uploads/${video}` : null, pdfUrl: pdf ? `${host}/uploads/${pdf}` : null, imageUrl: image ? `${host}/uploads/${image}` : null }),
        });
    }
    catch (err) {
        console.error("Error adding blog:", err);
        res.status(500).json({ success: false, error: "Failed to add blog" });
    }
});
exports.addBlog = addBlog;
// Get all blogs
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blogs_1.default.find();
        res.status(200).json({ success: true, data: blogs });
    }
    catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ success: false, error: "Failed to fetch blogs" });
    }
});
exports.getBlogs = getBlogs;
// Get a blog by ID
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield blogs_1.default.findById(id);
        if (!blog) {
            res.status(404).json({ success: false, error: "Blog not found" });
            return;
        }
        res.status(200).json({ success: true, data: blog });
    }
    catch (err) {
        console.error("Error fetching blog by ID:", err);
        res.status(500).json({ success: false, error: "Failed to fetch blog" });
    }
});
exports.getBlogById = getBlogById;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { id } = req.params;
    const { title, shortDescription, longDescription } = req.body;
    try {
        // Extract file paths from the uploaded files
        const video = ((_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.filename) || "";
        const pdf = ((_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.pdf) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename) || "";
        const image = ((_j = (_h = (_g = req.files) === null || _g === void 0 ? void 0 : _g.image) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.filename) || "";
        // Build the update object
        const updateData = {
            title,
            shortDescription,
            longDescription,
        };
        if (video)
            updateData.video = video;
        if (pdf)
            updateData.pdf = pdf;
        if (image)
            updateData.image = image;
        // Find the blog by ID and update it
        const updatedBlog = yield blogs_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated fields
        });
        if (!updatedBlog) {
            res.status(404).json({ success: false, error: "Blog not found" });
            return;
        }
        const host = `${req.protocol}://${req.get("host")}`;
        res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, updatedBlog.toJSON()), { videoUrl: updatedBlog.video ? `${host}/uploads/${updatedBlog.video}` : null, pdfUrl: updatedBlog.pdf ? `${host}/uploads/${updatedBlog.pdf}` : null, imageUrl: updatedBlog.image ? `${host}/uploads/${updatedBlog.image}` : null }),
        });
    }
    catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).json({ success: false, error: "Failed to update blog" });
    }
});
exports.updateBlog = updateBlog;
// Delete a blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield blogs_1.default.findByIdAndDelete(id);
        if (!blog) {
            res.status(404).json({ success: false, error: "Blog not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Blog deleted" });
    }
    catch (err) {
        console.error("Error deleting blog:", err);
        res.status(500).json({ success: false, error: "Failed to delete blog" });
    }
});
exports.deleteBlog = deleteBlog;
