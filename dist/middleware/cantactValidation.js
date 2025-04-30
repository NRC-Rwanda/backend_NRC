"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContactForm = void 0;
const express_validator_1 = require("express-validator");
exports.validateContactForm = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("phone").notEmpty().withMessage("Phone number is required"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];
