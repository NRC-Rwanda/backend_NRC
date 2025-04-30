"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const blogsController_1 = require("../controllers/blogsController");
const router = express_1.default.Router();
// Add a new blog with file uploads
router.post("/blogs", multerConfig_1.default.fields([{ name: "video" }, { name: "pdf" }, { name: "image" }]), blogsController_1.addBlog);
// Get all blogs
router.get("/blogs", blogsController_1.getBlogs);
// Get a blog by ID
router.get("/blogs/:id", blogsController_1.getBlogById);
// Update a blog
router.put("/blogs/:id", multerConfig_1.default.fields([{ name: "video" }, { name: "pdf" }, { name: "image" }]), blogsController_1.updateBlog);
// Delete a blog
router.delete("/blogs/:id", blogsController_1.deleteBlog);
exports.default = router;
