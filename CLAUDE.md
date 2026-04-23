# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then Vite production build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test framework is configured yet.

## Project name

The game is called **Dice Tactics**. The `design_handoff_dice_dungeon/` folder is the original design reference prototype and uses "Dice Dungeon" internally — do not use that name in user-facing strings.

## Architecture

React 19 + TypeScript card/combat game. Single-page app with **state-based screen routing** (no URL router — screens are switched via React state). Entry point: `src/main.tsx` → `src/Juego.tsx`.

### Screen flow

```
Juego.tsx (AuthProvider + AppScreen state)
  ├── Login  ──────────────────── /pages/Login.tsx
  ├── Register ────────────────── /pages/Register.tsx
  ├── MainMenu ────────────────── /pages/MainMenu.tsx   (checks apiGetSave for "Continuar" button)
  └── Game.tsx ────────────────── /pages/Game.tsx       (in-game state machine)
        ├── TransitionScreen  (inline in Game.tsx)
        ├── CombatPage ─────────── /pages/CombatPage.tsx
        ├── ShopPage ───────────── /pages/ShopPage.tsx
        ├── EventPage ──────────── /pages/EventPage.tsx
        └── ResultPage ─────────── /pages/ResultPage.tsx
```

### In-game floor progression

```
Floor 0 → Shop → Floor 1 → Event → Floor 2 → Shop → Floor 3 (Boss) → WinLose
```

Post-combat routing logic (in `Game.tsx::onCombatWin`):
- `nextFloor >= 4` → WIN
- `nextFloor % 2 === 1` → Shop (floors 1, 3)
- `nextFloor % 2 === 0` → Event (floor 2)

### State management

`src/context/AuthContext.tsx` — JWT auth (token persisted in `localStorage` as `dt_token`). Wraps the whole app in `Juego.tsx`.

`GameState` (defined in `src/types.ts`) is lifted through `Juego` → `Game` → child pages via props and callbacks. No global state library.

### Data layer (`src/data/`)

| File | Contents |
|------|----------|
| `cards.ts` | 15 cards, `STARTER_DECK`, `SHOP_POOL`, `checkRequirement()`, `cardPrice()` |
| `enemies.ts` | 3 regular enemies (floors 0–2): slime, golem, brujo |
| `bosses.ts` | 3 boss enemies (floor 3): dragon (default), lich, cyber_queen — `FINAL_BOSS = BOSSES[0]` |
| `boses.ts` | Re-export alias for `bosses.ts` |
| `events.ts` | 4 random events shown on even floors |
| `themes.ts` | `THEMES` record with `fantasy` and `scifi` token sets |

### API / persistence (`src/services/api.ts`)

Base URL: `VITE_API_URL` env var (defaults to `http://localhost:3000`).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Returns `{ token, user }` |
| `/api/auth/register` | POST | Returns `{ token, user }` |
| `/api/save` | GET | Returns `GameState \| null` |
| `/api/save` | POST | Upserts saved game |
| `/api/save` | DELETE | Removes save on win/lose |

Falls back to `localStorage` (`dt_save`) if the backend is unavailable.

### Database schema (backend, not in this repo)

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_games (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  floor        INTEGER NOT NULL,          -- current combat floor (0–3)
  deck         TEXT[]  NOT NULL,          -- card IDs only
  dice_count   INTEGER NOT NULL,
  hp           INTEGER NOT NULL,
  max_hp       INTEGER NOT NULL,
  gold         INTEGER NOT NULL DEFAULT 0,
  total_turns  INTEGER NOT NULL DEFAULT 0,
  saved_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)                         -- one save per user
);
```

### Theming

Two themes (`fantasy` / `scifi`) defined as `ThemeTokens` objects in `src/data/themes.ts`. All components receive the active `ThemeTokens` as a `theme` prop — no CSS variables. Google Fonts (Cinzel, Crimson Text, Orbitron, Rajdhani) are loaded in `index.html`.

### TypeScript config notes

`tsconfig.app.json` enables `noUnusedLocals` and `noUnusedParameters` — unused imports are compile errors. Target is ES2023, module resolution is `bundler`.

### Animation

Global CSS keyframes in `src/styles.css`: `pulse`, `floatUp`, `dieRoll`, `enemyHit`, `playerHit`, `fadeIn`, `progressFill`. Applied via `style={{ animation: '...' }}` inline — not via CSS classes.
