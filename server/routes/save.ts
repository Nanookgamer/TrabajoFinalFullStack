import { Router } from "express";
import type { Response } from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

function rowToGameState(row: Record<string, unknown>) {
  return {
    playerHp:    row.hp,
    playerMaxHp: row.max_hp,
    gold:        row.gold,
    deck:        row.deck,
    floor:       row.floor,
    totalTurns:  row.total_turns,
    diceCount:   row.dice_count,
  };
}

// GET /api/save  →  devuelve los 3 slots del usuario
// Responde: [{ slot: 1, data: GameState|null }, { slot: 2, ... }, { slot: 3, ... }]
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM saved_games WHERE user_id = $1 ORDER BY slot",
      [req.userId]
    );
    const bySlot = new Map(
      (result.rows as Record<string, unknown>[]).map(r => [r.slot, r])
    );
    const slots = [1, 2, 3].map(slot => ({
      slot,
      data: bySlot.has(slot) ? rowToGameState(bySlot.get(slot)!) : null,
    }));
    res.json(slots);
  } catch (err) {
    console.error("GET /api/save:", err);
    res.status(500).json({ message: "Error al cargar las partidas" });
  }
});

// POST /api/save/:slot  →  crea o actualiza un slot (1, 2 o 3)
router.post("/:slot", async (req: AuthRequest, res: Response) => {
  const slot = parseInt(req.params.slot as string);
  if (![1, 2, 3].includes(slot)) {
    res.status(400).json({ message: "Slot inválido (debe ser 1, 2 o 3)" });
    return;
  }

  const { playerHp, playerMaxHp, gold, deck, floor, totalTurns, diceCount } =
    req.body as Record<string, unknown>;

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
         (user_id, slot, hp, max_hp, gold, deck, floor, total_turns, dice_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id, slot) DO UPDATE SET
         hp          = EXCLUDED.hp,
         max_hp      = EXCLUDED.max_hp,
         gold        = EXCLUDED.gold,
         deck        = EXCLUDED.deck,
         floor       = EXCLUDED.floor,
         total_turns = EXCLUDED.total_turns,
         dice_count  = EXCLUDED.dice_count,
         saved_at    = NOW()`,
      [req.userId, slot, playerHp, playerMaxHp, gold, deck, floor, totalTurns, diceCount]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("POST /api/save/:slot:", err);
    res.status(500).json({ message: "Error al guardar la partida" });
  }
});

// DELETE /api/save/:slot  →  elimina un slot concreto
router.delete("/:slot", async (req: AuthRequest, res: Response) => {
  const slot = parseInt(req.params.slot as string);
  if (![1, 2, 3].includes(slot)) {
    res.status(400).json({ message: "Slot inválido" });
    return;
  }
  try {
    await pool.query(
      "DELETE FROM saved_games WHERE user_id = $1 AND slot = $2",
      [req.userId, slot]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/save/:slot:", err);
    res.status(500).json({ message: "Error al borrar la partida" });
  }
});

export default router;
