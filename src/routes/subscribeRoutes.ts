import { Router } from "express";
import { subscribe } from "../controllers/subscribeController";

const router = Router();

// POST /subscribers
router.post("/subscribers", subscribe);

export default router;
