/**
 * Migración automática de base de datos.
 *
 * Se ejecuta al arrancar el servidor y crea las tablas si no existen.
 * Si la tabla saved_games existe pero sin la columna "slot" (versión antigua
 * con un único guardado por usuario), la elimina y la recrea con el nuevo
 * esquema de 3 slots por usuario.
 *
 * No usa una herramienta de migraciones dedicada por simplicidad; para un
 * proyecto en producción se recomendaría node-pg-migrate o Flyway.
 */
import pool from "./db.js";

export async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL        PRIMARY KEY,
      username      VARCHAR(50)   UNIQUE NOT NULL,
      password_hash VARCHAR(255)  NOT NULL,
      created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
  `);

  // Crea la tabla de partidas con soporte de 3 slots por usuario.
  // Si ya existía con la restricción antigua (UNIQUE user_id) hay que
  // borrarla y recrearla; en instalaciones nuevas se crea directamente.
  await pool.query(`
    DO $$
    BEGIN
      -- Detecta si la columna slot ya existe
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'saved_games' AND column_name = 'slot'
      ) THEN
        -- Tabla antigua sin slot: la eliminamos y recreamos
        DROP TABLE IF EXISTS saved_games;
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS saved_games (
      id          SERIAL      PRIMARY KEY,
      user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      slot        SMALLINT    NOT NULL CHECK (slot BETWEEN 1 AND 3),
      floor       SMALLINT    NOT NULL CHECK (floor BETWEEN 0 AND 3),
      total_turns INTEGER     NOT NULL DEFAULT 0 CHECK (total_turns >= 0),
      hp          SMALLINT    NOT NULL CHECK (hp >= 0),
      max_hp      SMALLINT    NOT NULL CHECK (max_hp > 0),
      gold        INTEGER     NOT NULL DEFAULT 0 CHECK (gold >= 0),
      dice_count  SMALLINT    NOT NULL DEFAULT 3 CHECK (dice_count BETWEEN 1 AND 10),
      deck        TEXT[]      NOT NULL,
      saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, slot)
    );

    CREATE INDEX IF NOT EXISTS idx_saved_games_user ON saved_games (user_id);
  `);

  console.log("✓ Base de datos lista");
}
