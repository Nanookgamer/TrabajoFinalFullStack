/**
 * Gestor de pantallas del juego activo.
 *
 * Coordina la navegación entre las fases de la partida:
 *   - combat    → CombatPage  (combate por turnos)
 *   - shop      → ShopPage    (tienda entre combates)
 *   - event     → EventPage   (evento aleatorio)
 *   - result    → ResultPage  (victoria o derrota)
 *   - transition → TransitionScreen (pantalla de carga animada entre fases)
 *
 * Progresión de pisos:
 *   Piso 0 → Tienda → Piso 1 → Evento → Piso 2 → Tienda → Piso 3 (jefe) → Fin
 *
 * La lógica de ramificación post-combate está en onCombatWin:
 *   - nextFloor >= 4          → victoria (fin del juego)
 *   - nextFloor % 2 === 1     → tienda  (pisos 1, 3)
 *   - nextFloor % 2 === 0     → evento  (piso 2)
 */
import { useState } from "react";
import { apiSave, apiDeleteSave } from "../services/api";
import type { ThemeTokens, GameState, GameScreen } from "../types";
import TransitionScreen from "../components/TransitionScreen";
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

export default function Game({ theme: t, gameState, onGameStateChange, onReturnToMenu }: Props) {
  const [screen,        setScreen]        = useState<GameScreen>("combat");
  const [transitionMsg, setTransitionMsg] = useState("");

  // Muestra la pantalla de transición y cambia a `next` después de 2.4 s
  function goTo(next: GameScreen, message: string) {
    setTransitionMsg(message);
    setScreen("transition");
    setTimeout(() => setScreen(next), 2400);
  }

  // ── Callbacks de transición entre fases ─────────────────────────────────────

  function onCombatWin(updated: GameState) {
    onGameStateChange(updated);
    const nextFloor = updated.floor + 1;

    // El jugador ha completado todos los pisos → victoria
    if (nextFloor >= 4) {
      onGameStateChange({ ...updated, _won: true });
      apiDeleteSave().catch(() => {}); // Elimina la partida guardada al terminar
      setScreen("result");
      return;
    }

    // Avanza al siguiente piso y guarda el progreso
    const advanced = { ...updated, floor: nextFloor };
    onGameStateChange(advanced);
    apiSave(advanced).catch(() => {});

    // Pisos impares → tienda; pisos pares → evento
    if (nextFloor % 2 === 1) {
      goTo("shop", "ACCEDIENDO AL MERCADO...");
    } else {
      goTo("event", "EVENTO DETECTADO...");
    }
  }

  function onCombatLose(updated: GameState) {
    onGameStateChange({ ...updated, _won: false });
    apiDeleteSave().catch(() => {}); // Elimina la partida guardada al perder
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

  // ── Renderizado según la pantalla activa ─────────────────────────────────────

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
