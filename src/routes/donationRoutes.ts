import { Router } from "express";
import {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} from "../controllers/donationController";

const router = Router();

router.post("/donations", createDonation);
router.get("/donations", getDonations);
router.get("/donations/:id", getDonationById);
router.put("/donations/:id", updateDonation);
router.delete("/donations/:id", deleteDonation);

export default router;