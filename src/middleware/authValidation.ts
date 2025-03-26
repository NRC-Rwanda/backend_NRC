import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation rules for registration
export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
    }
    next();
  },
];