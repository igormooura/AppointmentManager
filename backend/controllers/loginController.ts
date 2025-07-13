import { Request, Response } from "express";
import { loginService } from "../services/loginService";

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "Email and code are required" });
      return;
    }

    const result = await loginService(email, Number(code));

    if (!result) {
      res.status(401).json({ message: "Invalid or expired code" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
};