"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/forgot-password", authController_1.forgotPassword);
router.put("/reset-password/:token", authController_1.resetPassword);
router.get("/users", authController_1.getUsers);
// Get user by ID
router.get("/users/:id", authController_1.getUserById);
router.put("/users/:id", authController_1.updateUser);
// Delete a user
router.delete("/users/:id", authController_1.deleteUser);
exports.default = router;
