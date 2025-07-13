import { config } from 'dotenv';
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

config();

authRouter.get("/verify-auth", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }

  const secret = process.env.JWT_KEY;
  if (!secret) {
    res.status(500).json({ message: "JWT secret key is not configured in environment" });
    return
    }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
    res.json({ authenticated: true, user: decoded });
  });
});

export default authRouter;