import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Sin token de autenticación" });
    return;
  }
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number };
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}
