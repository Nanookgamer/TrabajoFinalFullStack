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

## Architecture

**Dice Tactics** is a React 19 + TypeScript card/combat game with a planned PostgreSQL/JWT backend (connection strings in `.env`).

The root component is `src/Juego.tsx` (not `App.tsx`), mounted via `src/main.tsx`. No client-side router is installed yet — routing needs to be added before the page components can be wired up.

### Planned game flow

```
Login / Register → MainMenu → Game coordinator
                                ├── CombatPage   (battles)
                                ├── EventPage    (story events)
                                ├── ShopPage     (buy cards/upgrades)
                                └── ResultPage   (battle outcome)
```

### State management

`src/context/AuthContext.tsx` is the intended home for authentication state (JWT tokens, user session). No global state library is installed; Context API is the current plan.

### Data layer

`src/data/` will hold static game definitions:
- `cards.ts` — player card/ability definitions
- `enemies.ts` — encounter definitions
- `boses.ts` — boss definitions

`src/services/api.ts` is the single entry point for all backend HTTP calls.

### Component structure

`src/components/` is organised by feature domain: `Combat/`, `Event/`, `Shop/`, `UI/`. Reusable primitives go in `UI/`.

## TypeScript config notes

`tsconfig.app.json` enables `noUnusedLocals` and `noUnusedParameters`, so unused imports/variables are compile errors. Target is ES2023, module resolution is `bundler`.
