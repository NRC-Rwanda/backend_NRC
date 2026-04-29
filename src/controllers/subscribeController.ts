import { Request, Response } from "express";
import Subscriber from "../models/subscribe";
import sendEmail from "../utils/sendEmail";

export const subscribe = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      res.status(409).json({ message: "Email already subscribed" });
      return;
    }

    // Save subscriber
    await Subscriber.create({ email });

    // ✅ Professional HTML confirmation email
    await sendEmail({
      email,
      subject: "Subscription Confirmed | Nursing Research Club",
      message: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #14532d;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 15px;
      font-size: 13px;
      text-align: center;
      color: #666;
    }
    ul {
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nursing Research Club</h2>
    </div>
    <div class="content">
      <p>Hello,</p>

      <p>
        Thank you for subscribing to the <strong>Nursing Research Club</strong>
        newsletter. Your subscription has been successfully confirmed.
      </p>

      <p>You will now receive updates on:</p>
      <ul>
        <li>Research activities</li>
        <li>Publications</li>
        <li>Opportunities and events</li>
      </ul>

      <p>
        If you did not request this subscription, you may safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>Nursing Research Club (NRC)</strong><br />
        Kigali, Rwanda
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Nursing Research Club. All rights reserved.
    </div>
  </div>
</body>
</html>
      `,
    });

    res.status(201).json({
      message: "Subscription successful! Please check your email 📩",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
