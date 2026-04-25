import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Máximo 5 usuarios
  const count = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(count.rows[0].count) >= 5) {
    return res.status(403).json({ error: 'Límite de usuarios alcanzado' });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (e: any) {
    // username duplicado
    res.status(400).json({ error: 'El nombre de usuario ya existe' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1', [username]
  );
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );
  res.json({ token, username: user.username, id: user.id });
});

export default router;