"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for registration
exports.validateRegister = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }
        next();
    },
];
