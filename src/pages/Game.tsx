import { useState } from "react";
import { apiSave, apiDeleteSave } from "../services/api";
import type { ThemeTokens, GameState, GameScreen } from "../types";
import CombatPage from "./CombatPage";
import ShopPage from "./ShopPage";
import EventPage from "./EventPage";
import ResultPage from "./ResultPage";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onGameStateChange: (s: GameState) => void;
  onReturnToMenu: () => void;
}

function TransitionScreen({ theme: t, message }: { theme: ThemeTokens; message: string }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
    }}>
      <div style={{
        fontFamily: t.titleFont, color: t.primary, fontSize: 22,
        letterSpacing: 4, animation: "pulse 1s infinite",
      }}>
        {message}
      </div>
      <div style={{ width: 260, height: 4, background: t.surface2, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", background: t.primary, borderRadius: 2,
          animation: "progressFill 2.2s ease-out forwards",
        }} />
      </div>
    </div>
  );
}

export default function Game({ theme: t, gameState, onGameStateChange, onReturnToMenu }: Props) {
  const [screen, setScreen] = useState<GameScreen>("combat");
  const [transitionMsg, setTransitionMsg] = useState("");

  function goTo(next: GameScreen, message: string) {
    setTransitionMsg(message);
    setScreen("transition");
    setTimeout(() => setScreen(next), 2400);
  }

  function onCombatWin(updated: GameState) {
    onGameStateChange(updated);
    const nextFloor = updated.floor + 1;

    if (nextFloor >= 4) {
      onGameStateChange({ ...updated, _won: true });
      apiDeleteSave().catch(() => {});
      setScreen("result");
      return;
    }

    const advanced = { ...updated, floor: nextFloor };
    onGameStateChange(advanced);
    apiSave(advanced).catch(() => {});

    if (nextFloor % 2 === 1) {
      goTo("shop", "ACCEDIENDO AL MERCADO...");
    } else {
      goTo("event", "EVENTO DETECTADO...");
    }
  }

  function onCombatLose(updated: GameState) {
    onGameStateChange({ ...updated, _won: false });
    apiDeleteSave().catch(() => {});
    setScreen("result");
  }

  function onShopDone(updated: GameState) {
    onGameStateChange(updated);
    apiSave(updated).catch(() => {});
    goTo("combat", "INICIANDO PROTOCOLO...");
  }

  function onEventDone(updated: GameState) {
    onGameStateChange(updated);
    apiSave(updated).catch(() => {});
    goTo("combat", "PROTOCOLO ACTIVO...");
  }

  switch (screen) {
    case "transition":
      return <TransitionScreen theme={t} message={transitionMsg} />;
    case "combat":
      return <CombatPage theme={t} gameState={gameState} onWin={onCombatWin} onLose={onCombatLose} />;
    case "shop":
      return <ShopPage theme={t} gameState={gameState} onDone={onShopDone} />;
    case "event":
      return <EventPage theme={t} gameState={gameState} onDone={onEventDone} />;
    case "result":
      return <ResultPage theme={t} gameState={gameState} onReturnToMenu={onReturnToMenu} onNewGame={onReturnToMenu} />;
  }
}
