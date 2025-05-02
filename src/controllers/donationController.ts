import { Request, Response } from 'express';
import { Donation } from '../models/donation';
import { initiateIremboPayment } from '../services/iremboPayService';

export const submitDonation = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      firstName,
      lastName,
      email,
      status,
      address,
      city,
      country,
      phone,
      paymentMethod,
      contactOk
    } = req.body;

    // 1. Save donation to database
    const donation = new Donation({
      amount,
      firstName,
      lastName,
      email,
      status,
      address,
      city,
      country,
      phone,
      paymentMethod,
      contactOk,
      paymentStatus: 'pending'
    });
    await donation.save();

    // 2. Initiate payment with IremboPay (if not bank transfer)
    if (paymentMethod !== 'bank-transfer') {
      const paymentResult = await initiateIremboPayment(
        amount,
        email,
        phone,
        `${process.env.FRONTEND_URL}/payment-callback`
      );

      if (paymentResult.status === 'success') {
        donation.iremboTransactionId = paymentResult.transactionId;
        await donation.save();

        return res.status(200).json({
          success: true,
          paymentUrl: paymentResult.paymentUrl
        });
      } else {
        donation.paymentStatus = 'failed';
        await donation.save();

        return res.status(400).json({
          success: false,
          message: 'Payment initiation failed'
        });
      }
    }

    // 3. For bank transfers, just confirm
    return res.status(200).json({
      success: true,
      message: 'Bank transfer details will be sent to your email'
    });

  } catch (error) {
    console.error('Donation submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};