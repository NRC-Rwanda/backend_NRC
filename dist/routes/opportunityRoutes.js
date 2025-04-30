"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const opportunirtyController_1 = require("../controllers/opportunirtyController");
const router = express_1.default.Router();
// Add a new opportunity
router.post("/opportunities", opportunirtyController_1.addOpportunity);
// Get all opportunities
router.get("/opportunities", opportunirtyController_1.getOpportunities);
// Get an opportunity by ID
router.get("/opportunities/:id", opportunirtyController_1.getOpportunityById);
// Update an opportunity
router.put("/opportunities/:id", opportunirtyController_1.updateOpportunity);
// Delete an opportunity
router.delete("/opportunities/:id", opportunirtyController_1.deleteOpportunity);
exports.default = router;
