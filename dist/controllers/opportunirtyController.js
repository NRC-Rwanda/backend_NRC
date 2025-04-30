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
exports.updateOpportunity = exports.getOpportunityById = exports.deleteOpportunity = exports.getOpportunities = exports.addOpportunity = void 0;
const opportunity_1 = __importDefault(require("../models/opportunity"));
// Add a new opportunity
const addOpportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, image, link } = req.body;
    try {
        const opportunity = yield opportunity_1.default.create({
            title,
            shortDescription,
            image,
            link,
        });
        res.status(201).json({ success: true, data: opportunity });
    }
    catch (err) {
        console.error("Error adding opportunity:", err);
        res.status(500).json({ success: false, error: "Failed to add opportunity" });
    }
});
exports.addOpportunity = addOpportunity;
// Get all opportunities
const getOpportunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const opportunities = yield opportunity_1.default.find();
        res.status(200).json({ success: true, data: opportunities });
    }
    catch (err) {
        console.error("Error fetching opportunities:", err);
        res.status(500).json({ success: false, error: "Failed to fetch opportunities" });
    }
});
exports.getOpportunities = getOpportunities;
// Delete an opportunity
const deleteOpportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const opportunity = yield opportunity_1.default.findByIdAndDelete(id);
        if (!opportunity) {
            res.status(404).json({ success: false, error: "Opportunity not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Opportunity deleted" });
    }
    catch (err) {
        console.error("Error deleting opportunity:", err);
        res.status(500).json({ success: false, error: "Failed to delete opportunity" });
    }
});
exports.deleteOpportunity = deleteOpportunity;
// Get an opportunity by ID
const getOpportunityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const opportunity = yield opportunity_1.default.findById(id);
        if (!opportunity) {
            res.status(404).json({ success: false, error: "Opportunity not found" });
            return;
        }
        res.status(200).json({ success: true, data: opportunity });
    }
    catch (err) {
        console.error("Error fetching opportunity by ID:", err);
        res.status(500).json({ success: false, error: "Failed to fetch opportunity" });
    }
});
exports.getOpportunityById = getOpportunityById;
// Update an opportunity
const updateOpportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, shortDescription, image, link } = req.body;
    try {
        const updatedOpportunity = yield opportunity_1.default.findByIdAndUpdate(id, { title, shortDescription, image, link }, { new: true, runValidators: true } // Return the updated document and validate fields
        );
        if (!updatedOpportunity) {
            res.status(404).json({ success: false, error: "Opportunity not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedOpportunity });
    }
    catch (err) {
        console.error("Error updating opportunity:", err);
        res.status(500).json({ success: false, error: "Failed to update opportunity" });
    }
});
exports.updateOpportunity = updateOpportunity;
