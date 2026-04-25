import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);  // todas las rutas aquí requieren login

// GET /api/games  →  lista las partidas del usuario
router.get('/', async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT * FROM saved_games WHERE user_id = $1 ORDER BY slot',
    [req.userId]
  );
  res.json(result.rows);
});

// POST /api/games/:slot  →  guarda o sobreescribe una partida
router.post('/:slot', async (req: AuthRequest, res: Response) => {
  const slot = parseInt(req.params.slot);
  if (![1,2,3].includes(slot)) return res.status(400).json({ error: 'Slot inválido' });

  // Comprobar si ya tiene 3 partidas y este slot es nuevo
  const existing = await pool.query(
    'SELECT id FROM saved_games WHERE user_id = $1 AND slot = $2',
    [req.userId, slot]
  );
  if (existing.rows.length === 0) {
    const count = await pool.query(
      'SELECT COUNT(*) FROM saved_games WHERE user_id = $1', [req.userId]
    );
    if (parseInt(count.rows[0].count) >= 3)
      return res.status(403).json({ error: 'Máximo 3 partidas por usuario' });
  }

  const { hp_current, hp_max, mana_dice, last_node, cards, wins, losses } = req.body;

  // INSERT si no existe, UPDATE si ya existe (upsert)
  const result = await pool.query(
    `INSERT INTO saved_games (user_id, slot, hp_current, hp_max, mana_dice, last_node, cards, wins, losses)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id, slot) DO UPDATE SET
       hp_current=$3, hp_max=$4, mana_dice=$5, last_node=$6, cards=$7, wins=$8, losses=$9
     RETURNING *`,
    [req.userId, slot, hp_current, hp_max, mana_dice, last_node, JSON.stringify(cards), wins, losses]
  );
  res.json(result.rows[0]);
});

// DELETE /api/games/:slot  →  borra una partida
router.delete('/:slot', async (req: AuthRequest, res: Response) => {
  const slot = parseInt(req.params.slot);
  await pool.query(
    'DELETE FROM saved_games WHERE user_id = $1 AND slot = $2',
    [req.userId, slot]
  );
  res.json({ ok: true });
});

export default router;