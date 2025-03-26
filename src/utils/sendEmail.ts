import nodemailer from "nodemailer";

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // 1. Create a transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: "NRC Team <noreply@nrc.org>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: `<p>${options.message}</p>` (for HTML emails)
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;