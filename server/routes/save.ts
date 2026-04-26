import { Router } from "express";
import type { Response } from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

// GET /api/save  →  partida guardada del usuario, o null
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM saved_games WHERE user_id = $1",
      [req.userId]
    );
    if (result.rows.length === 0) {
      res.json(null);
      return;
    }
    const row = result.rows[0] as {
      hp: number; max_hp: number; gold: number; deck: string[];
      floor: number; total_turns: number; dice_count: number;
    };
    res.json({
      playerHp:    row.hp,
      playerMaxHp: row.max_hp,
      gold:        row.gold,
      deck:        row.deck,
      floor:       row.floor,
      totalTurns:  row.total_turns,
      diceCount:   row.dice_count,
    });
  } catch (err) {
    console.error("GET /api/save:", err);
    res.status(500).json({ message: "Error al cargar la partida" });
  }
});

// POST /api/save  →  crea o sobreescribe la partida del usuario
router.post("/", async (req: AuthRequest, res: Response) => {
  const { playerHp, playerMaxHp, gold, deck, floor, totalTurns, diceCount } =
    req.body as {
      playerHp?: number; playerMaxHp?: number; gold?: number;
      deck?: string[]; floor?: number; totalTurns?: number; diceCount?: number;
    };

  if (
    playerHp == null || playerMaxHp == null || gold == null ||
    !Array.isArray(deck) || floor == null || totalTurns == null || diceCount == null
  ) {
    res.status(400).json({ message: "Datos de partida incompletos" });
    return;
  }

  try {
    await pool.query(
      `INSERT INTO saved_games
         (user_id, hp, max_hp, gold, deck, floor, total_turns, dice_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         hp          = EXCLUDED.hp,
         max_hp      = EXCLUDED.max_hp,
         gold        = EXCLUDED.gold,
         deck        = EXCLUDED.deck,
         floor       = EXCLUDED.floor,
         total_turns = EXCLUDED.total_turns,
         dice_count  = EXCLUDED.dice_count,
         saved_at    = NOW()`,
      [req.userId, playerHp, playerMaxHp, gold, deck, floor, totalTurns, diceCount]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("POST /api/save:", err);
    res.status(500).json({ message: "Error al guardar la partida" });
  }
});

// DELETE /api/save  →  elimina la partida del usuario (fin de partida)
router.delete("/", async (req: AuthRequest, res: Response) => {
  try {
    await pool.query("DELETE FROM saved_games WHERE user_id = $1", [req.userId]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/save:", err);
    res.status(500).json({ message: "Error al borrar la partida" });
  }
});

export default router;
