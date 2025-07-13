import { Request, Response, NextFunction } from "express";
import { verifyToken, UserPayload } from "../utilities/jwt";

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const authenticateJWT = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const user = verifyToken(token);

    if (!user.mfaCompleted) {
      res.status(403).json({ message: "MFA not completed" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
