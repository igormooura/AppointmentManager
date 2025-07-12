import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateCode } from "../utilities/code";

dotenv.config();

const transporter = nodemailer.createTransport({ //singleton
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function sendCodeByEmail(email: string): Promise<number> {
  const code = await generateCode(email);

  const mailOptions = {
    from: `"Appointment Auth" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your MFA Login Code",
    text: `Your login code is: ${code}. It expires in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);

  return code;
}
