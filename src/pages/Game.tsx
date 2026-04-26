/**
 * Máquina de estados del juego activo.
 *
 * Game.tsx no renderiza contenido propio: coordina qué pantalla
 * se muestra en cada momento y gestiona las transiciones entre fases.
 *
 * Progresión de pisos:
 *   Piso 0 → Shop → Piso 1 → Event → Piso 2 → Shop → Piso 3 (Jefe) → Resultado
 *
 * Lógica de transición (onCombatWin):
 *   - nextFloor >= 4       → victoria, eliminar guardado
 *   - nextFloor % 2 === 1  → tienda (pisos 1 y 3)
 *   - nextFloor % 2 === 0  → evento (piso 2)
 *
 * El auto-guardado se realiza en cada transición de fase (apiSave).
 * Al ganar o perder se elimina el guardado (apiDeleteSave) para liberar el slot.
 *
 * El botón de salida al menú se superpone como overlay fijo sobre todas las
 * pantallas excepto transición y resultado, usando z-index 9999.
 */

import { useState } from "react";
import { apiSave, apiDeleteSave } from "../services/api";
import type { ThemeTokens, GameState, GameScreen } from "../types";
import TransitionScreen from "../components/TransitionScreen";
import CombatPage from "./CombatPage";
import ShopPage from "./ShopPage";
import EventPage from "./EventPage";
import ResultPage from "./ResultPage";

// Cargamos los Props
interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  slot: number;
  onGameStateChange: (s: GameState) => void;
  onReturnToMenu: () => void;
}

export default function Game({ theme: t, gameState, slot, onGameStateChange, onReturnToMenu }: Props) {
  const [screen,        setScreen]        = useState<GameScreen>("combat");
  const [transitionMsg, setTransitionMsg] = useState("");
  const [exitConfirm,   setExitConfirm]   = useState(false);

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
      apiDeleteSave(slot).catch(() => {});
      setScreen("result");
      return;
    }
    const advanced = { ...updated, floor: nextFloor };
    onGameStateChange(advanced);
    apiSave(advanced, slot).catch(() => {});
    if (nextFloor % 2 === 1) {
      goTo("shop", "ACCEDIENDO AL MERCADO...");
    } else {
      goTo("event", "EVENTO DETECTADO...");
    }
  }

  function onCombatLose(updated: GameState) {
    onGameStateChange({ ...updated, _won: false });
    apiDeleteSave(slot).catch(() => {});
    setScreen("result");
  }

  function onShopDone(updated: GameState) {
    onGameStateChange(updated);
    apiSave(updated, slot).catch(() => {});
    goTo("combat", "INICIANDO PROTOCOLO...");
  }

  function onEventDone(updated: GameState) {
    onGameStateChange(updated);
    apiSave(updated, slot).catch(() => {});
    goTo("combat", "PROTOCOLO ACTIVO...");
  }

  // ── Pantalla activa ──────────────────────────────────────────────────────────
  const showExitBtn = screen !== "result" && screen !== "transition";

  let content: React.ReactNode;
  switch (screen) {
    case "transition":
      content = <TransitionScreen theme={t} message={transitionMsg} />;
      break;
    case "combat":
      content = <CombatPage theme={t} gameState={gameState} onWin={onCombatWin} onLose={onCombatLose} />;
      break;
    case "shop":
      content = <ShopPage theme={t} gameState={gameState} onDone={onShopDone} />;
      break;
    case "event":
      content = <EventPage theme={t} gameState={gameState} onDone={onEventDone} />;
      break;
    case "result":
      content = <ResultPage theme={t} gameState={gameState} onReturnToMenu={onReturnToMenu} onNewGame={onReturnToMenu} />;
      break;
  }

  return (
    <>
      {content}

      {/* Botón de salida al menú (no aparece en transición ni en resultado) */}
      {showExitBtn && (
        <div style={{
          position: "fixed", bottom: 20, right: 20,
          zIndex: 9999,
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
        }}>
          {exitConfirm ? (
            <>
              <div style={{
                background: t.surface2, border: `1px solid ${t.border}`,
                borderRadius: 3, padding: "10px 14px",
                fontFamily: t.bodyFont, fontSize: 13, color: t.textDim,
                textAlign: "center",
              }}>
                ¿Salir al menú?<br />
                <span style={{ fontSize: 11 }}>La partida está guardada.</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setExitConfirm(false)}
                  style={{
                    padding: "8px 16px",
                    background: "transparent", border: `1px solid ${t.border}`,
                    color: t.textDim, fontFamily: t.titleFont,
                    fontSize: 11, letterSpacing: 2, cursor: "pointer", borderRadius: 2,
                  }}
                >
                  CANCELAR
                </button>
                <button
                  onClick={onReturnToMenu}
                  style={{
                    padding: "8px 16px",
                    background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
                    color: t.text, fontFamily: t.titleFont,
                    fontSize: 11, letterSpacing: 2, cursor: "pointer", borderRadius: 2,
                  }}
                >
                  SALIR AL MENÚ
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setExitConfirm(true)}
              title="Salir al menú principal"
              style={{
                padding: "8px 14px",
                background: t.accent2, border: `1px solid ${t.border}`,
                color: t.bg, fontFamily: t.titleFont,
                fontSize: 11, letterSpacing: 2, cursor: "pointer", borderRadius: 2,
                opacity: 0.7,
              }}
            >
              ⏻ MENÚ
            </button>
          )}
        </div>
      )}
    </>
  );
}
