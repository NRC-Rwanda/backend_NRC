import { Request, Response } from "express";
import Donation from "../models/donation";

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { amount, firstName, lastName, email, address, city, country, phone } = req.body;

    if (!amount || !firstName || !email || !address || !city || !country || !phone) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const donation = new Donation({
      ...req.body,
      contactOk: req.body.contactOk || false,
    });

    await donation.save();

    res.status(201).json({
      success: true,
      data: donation,
      message: "Donation created successfully",
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDonationById = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      res.status(404).json({
        success: false,
        message: "Donation not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!donation) {
       res.status(404).json({
        success: false,
        message: "Donation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: donation,
      message: "Donation updated successfully",
    });
  } catch (error) {
    console.error("Error updating donation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      res.status(404).json({
        success: false,
        message: "Donation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};