import express from "express";
import { login, register,forgotPassword, resetPassword} from "../controllers/authController";
import { validateRegister } from "../middleware/authValidation";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;