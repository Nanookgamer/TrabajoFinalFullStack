/**
 * Rutas de autenticación de Dice Tactics.
 *
 *   POST /api/auth/register — crea un usuario nuevo y devuelve un JWT.
 *   POST /api/auth/login    — verifica credenciales y devuelve un JWT.
 *
 * Ambas rutas limitan el registro a un máximo de 5 usuarios y
 * guardan la contraseña como hash bcrypt (salt rounds = 10).
 * El token JWT tiene validez de 3 horas.
 */
import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username?.trim() || !password || password.length < 3) {
    res
      .status(400)
      .json({ message: "Usuario requerido y contraseña mínimo 3 caracteres" });
    return;
  }

  const count = await pool.query("SELECT COUNT(*) FROM users");
  if (parseInt(count.rows[0].count) >= 5) {
    res.status(403).json({ message: "Límite de usuarios alcanzado" });
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username.trim(), hash]
    );
    const user = result.rows[0] as { id: number; username: string };
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "3h" }
    );
    res.status(201).json({ token, user });
  } catch {
    res.status(400).json({ message: "El nombre de usuario ya existe" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ message: "Usuario y contraseña requeridos" });
    return;
  }

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  const row = result.rows[0] as
    | { id: number; username: string; password_hash: string }
    | undefined;

  if (!row) {
    res.status(401).json({ message: "Usuario no encontrado" });
    return;
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    res.status(401).json({ message: "Contraseña incorrecta" });
    return;
  }

  const token = jwt.sign(
    { id: row.id, username: row.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "3h" }
  );
  res.json({ token, user: { id: row.id, username: row.username } });
});

export default router;
