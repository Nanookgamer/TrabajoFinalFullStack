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

    CREATE TABLE IF NOT EXISTS saved_games (
      id          SERIAL      PRIMARY KEY,
      user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      floor       SMALLINT    NOT NULL CHECK (floor BETWEEN 0 AND 3),
      total_turns INTEGER     NOT NULL DEFAULT 0 CHECK (total_turns >= 0),
      hp          SMALLINT    NOT NULL CHECK (hp >= 0),
      max_hp      SMALLINT    NOT NULL CHECK (max_hp > 0),
      gold        INTEGER     NOT NULL DEFAULT 0 CHECK (gold >= 0),
      dice_count  SMALLINT    NOT NULL DEFAULT 3 CHECK (dice_count BETWEEN 1 AND 10),
      deck        TEXT[]      NOT NULL,
      saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_saved_games_user ON saved_games (user_id);
  `);

  console.log("✓ Base de datos lista");
}
