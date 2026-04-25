/**
 * Componente raíz de Dice Tactics.
 *
 * Juego envuelve toda la aplicación en AuthProvider para que el contexto
 * de autenticación esté disponible en todas las pantallas.
 *
 * AppRouter gestiona la navegación entre pantallas mediante estado React
 * (no hay router de URLs — las pantallas se cambian con setScreen).
 * Flujo de pantallas: Login / Register → MainMenu → Game.
 */
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { THEMES } from "./data/themes";
import { STARTER_DECK } from "./data/cards";
import type { AppScreen, GameState } from "./types";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import "./styles.css";

// Tema visual activo (solo existe "scifi" por ahora)
const t = THEMES["scifi"];

// Valores iniciales de una partida nueva
const STARTING_HP   = 40;
const STARTING_DICE = 3;

// ── Componente interno ────────────────────────────────────────────────────────
// Usa useAuth, por lo que debe estar dentro de AuthProvider

function AppRouter() {
  const { user } = useAuth();
  const [screen, setScreen]       = useState<AppScreen>("login");
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Si no hay sesión iniciada, mostrar login o registro
  if (!user) {
    if (screen === "register") {
      return (
        <Register
          theme={t}
          onSuccess={() => setScreen("menu")}
          onBack={() => setScreen("login")}
        />
      );
    }
    return (
      <Login
        theme={t}
        onSuccess={() => setScreen("menu")}
        onRegister={() => setScreen("register")}
      />
    );
  }

  // Menú principal: permite iniciar nueva partida o continuar la guardada
  if (screen === "menu") {
    return (
      <MainMenu
        theme={t}
        onNewGame={() => {
          // Crea un estado de partida con los valores iniciales
          setGameState({
            playerHp:    STARTING_HP,
            playerMaxHp: STARTING_HP,
            gold:        0,
            deck:        [...STARTER_DECK],
            floor:       0,
            totalTurns:  0,
            diceCount:   STARTING_DICE,
          });
          setScreen("game");
        }}
        onContinue={(saved) => {
          setGameState(saved);
          setScreen("game");
        }}
      />
    );
  }

  // Pantalla de juego activo
  if (screen === "game" && gameState) {
    return (
      <Game
        theme={t}
        gameState={gameState}
        onGameStateChange={setGameState}
        onReturnToMenu={() => {
          setGameState(null);
          setScreen("menu");
        }}
      />
    );
  }

  return null;
}

// ── Componente raíz exportado ─────────────────────────────────────────────────
// Envuelve AppRouter en AuthProvider para que useAuth funcione en toda la app

export default function Juego() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
