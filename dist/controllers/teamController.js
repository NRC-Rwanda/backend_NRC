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
exports.getTeamMembersByCategory = exports.deleteTeamMember = exports.updateTeamMember = exports.getTeamMemberById = exports.getTeamMembers = exports.addTeamMember = void 0;
const team_1 = __importDefault(require("../models/team"));
// Add a new team member
const addTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Parse and trim the request body fields
        const name = (_a = req.body.name) === null || _a === void 0 ? void 0 : _a.trim().replace(/^"|"$/g, "");
        const role = (_b = req.body.role) === null || _b === void 0 ? void 0 : _b.trim().replace(/^"|"$/g, "");
        const shortDescription = (_c = req.body.shortDescription) === null || _c === void 0 ? void 0 : _c.trim().replace(/^"|"$/g, "");
        const category = (_d = req.body.category) === null || _d === void 0 ? void 0 : _d.trim().replace(/^"|"$/g, "");
        const year = (_e = req.body.year) === null || _e === void 0 ? void 0 : _e.trim().replace(/^"|"$/g, "");
        // Validate required fields
        if (!name || !role || !category) {
            res.status(400).json({
                success: false,
                error: "Name, role, and category are required fields.",
            });
            return;
        }
        const image = ((_f = req.file) === null || _f === void 0 ? void 0 : _f.filename) || ""; // Get the uploaded file's name
        const teamMember = yield team_1.default.create({
            name,
            role,
            image: `/uploads/${image}`, // Save the file path
            shortDescription,
            category,
            year,
        });
        const host = `${req.protocol}://${req.get("host")}`;
        res.status(201).json({
            success: true,
            data: Object.assign(Object.assign({}, teamMember.toJSON()), { imageUrl: image ? `${host}/uploads/${image}` : null }),
        });
    }
    catch (err) {
        console.error("Error adding team member:", err);
        res.status(500).json({ success: false, error: "Failed to add team member" });
    }
});
exports.addTeamMember = addTeamMember;
// Get all team members
const getTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamMembers = yield team_1.default.find();
        res.status(200).json({ success: true, data: teamMembers });
    }
    catch (err) {
        console.error("Error fetching team members:", err);
        res.status(500).json({ success: false, error: "Failed to fetch team members" });
    }
});
exports.getTeamMembers = getTeamMembers;
// Get a team member by ID
const getTeamMemberById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const teamMember = yield team_1.default.findById(id);
        if (!teamMember) {
            res.status(404).json({ success: false, error: "Team member not found" });
            return;
        }
        res.status(200).json({ success: true, data: teamMember });
    }
    catch (err) {
        console.error("Error fetching team member by ID:", err);
        res.status(500).json({ success: false, error: "Failed to fetch team member" });
    }
});
exports.getTeamMemberById = getTeamMemberById;
// Update a team member
const updateTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, role, shortDescription, category, year } = req.body;
    try {
        const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || ""; // Get the uploaded file's name
        // Build the update object
        const updateData = {
            name,
            role,
            shortDescription,
            category,
            year,
        };
        if (image)
            updateData.image = `/uploads/${image}`;
        // Find the team member by ID and update their details
        const updatedTeamMember = yield team_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated fields
        });
        if (!updatedTeamMember) {
            res.status(404).json({ success: false, error: "Team member not found" });
            return;
        }
        const host = `${req.protocol}://${req.get("host")}`;
        res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, updatedTeamMember.toJSON()), { imageUrl: updatedTeamMember.image ? `${host}${updatedTeamMember.image}` : null }),
        });
    }
    catch (err) {
        console.error("Error updating team member:", err);
        res.status(500).json({ success: false, error: "Failed to update team member" });
    }
});
exports.updateTeamMember = updateTeamMember;
// Delete a team member
const deleteTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const teamMember = yield team_1.default.findByIdAndDelete(id);
        if (!teamMember) {
            res.status(404).json({ success: false, error: "Team member not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Team member deleted" });
    }
    catch (err) {
        console.error("Error deleting team member:", err);
        res.status(500).json({ success: false, error: "Failed to delete team member" });
    }
});
exports.deleteTeamMember = deleteTeamMember;
const getTeamMembersByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const teamMembers = yield team_1.default.find({ category });
        if (!teamMembers || teamMembers.length === 0) {
            res.status(404).json({ success: false, error: "No team members found for this category" });
            return;
        }
        res.status(200).json({ success: true, data: teamMembers });
    }
    catch (err) {
        console.error("Error fetching team members by category:", err);
        res.status(500).json({ success: false, error: "Failed to fetch team members by category" });
    }
});
exports.getTeamMembersByCategory = getTeamMembersByCategory;
