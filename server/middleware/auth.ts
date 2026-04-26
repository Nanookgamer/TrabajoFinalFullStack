/**
 * Middleware de autenticación JWT para rutas protegidas.
 *
 * Extrae el token del header "Authorization: Bearer <token>",
 * lo verifica con JWT_SECRET y adjunta el userId al objeto Request.
 * Si el token falta o es inválido/expirado devuelve 401.
 *
 * Uso: router.use(authMiddleware) al principio de cada router protegido.
 */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extiende Request de Express para incluir el userId extraído del token
export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // El token viene en el header "Authorization: Bearer <token>"
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
    req.userId = payload.id; // Disponible para los handlers de ruta posteriores
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}
