import { Request, Response } from "express";
import { sendCodeByEmail } from "../services/sendCodeService";
import { loginService } from "../services/loginService";

export const requestCodeController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await sendCodeByEmail(email);
    res.status(200).json({ message: "Code sent to your email" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send code";
    res.status(500).json({ message: errorMessage });
  }
};
