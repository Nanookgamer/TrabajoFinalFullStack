import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { THEMES } from "./data/themes";
import type { AppScreen, GameState } from "./types";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainMenu from "./pages/MainMenu";
import LoadGame from "./pages/LoadGame";
import Game from "./pages/Game";
import "./styles.css";

const t = THEMES["scifi"];

function AppRouter() {
  const { user } = useAuth();

  const [screen,    setScreen]    = useState<AppScreen>(() =>
    localStorage.getItem("dt_token") ? "menu" : "login"
  );
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [slot,      setSlot]      = useState<number>(1);

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

  if (screen === "menu") {
    return (
      <MainMenu
        theme={t}
        onPlay={() => setScreen("loadgame")}
      />
    );
  }

  if (screen === "loadgame") {
    return (
      <LoadGame
        theme={t}
        onStartGame={(state, selectedSlot) => {
          setGameState(state);
          setSlot(selectedSlot);
          setScreen("game");
        }}
        onBack={() => setScreen("menu")}
      />
    );
  }

  if (screen === "game" && gameState) {
    return (
      <Game
        theme={t}
        gameState={gameState}
        slot={slot}
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

export default function Juego() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
