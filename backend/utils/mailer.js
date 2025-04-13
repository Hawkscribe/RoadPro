// utils/mailer.js
import nodemailer from 'nodemailer';

export const sendThankYouEmail = (to, postInfo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Gmail user
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: 'Thank you for reporting!',
    text: `Thank you for reporting the issue. We’ve received your report: ${postInfo}`
  };

  return transporter.sendMail(mailOptions);
};
