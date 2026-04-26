/**
 * Panel izquierdo del combate que muestra la información del jugador:
 * imagen, nombre, barra de vida y efectos de estado activos
 * (bloque, reflejo, regeneración).
 *
 * La animación "playerHit" se activa al recibir daño del enemigo.
 * El bloque 9999 se muestra como "∞" (bloqueo infinito del Escudo Mágico).
 */
import HpBar from "./HpBar";
import type { ThemeTokens } from "../types";

interface Props {
  playerHp: number;
  playerMaxHp: number;
  playerBlock: number;
  reflect: boolean;
  regenTurns: number;
  isHit: boolean;
  theme: ThemeTokens;
}

export default function PlayerPanel({
  playerHp, playerMaxHp, playerBlock, reflect, regenTurns, isHit, theme: t,
}: Props) {
  return (
    <div style={{
      width: 210, flexShrink: 0,
      background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
      padding: "16px 12px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      animation: isHit ? "playerHit 0.4s ease-out" : undefined,
    }}>
      <img
        src="/img/player/player.png"
        alt="Operador"
        style={{
          width: 120, height: 120,
          objectFit: "contain",
          imageRendering: "pixelated",
          filter: `drop-shadow(0 0 8px ${t.primary}66)`,
        }}
      />

      <div style={{
        fontFamily: t.titleFont, fontSize: 13,
        color: t.primary, textAlign: "center", letterSpacing: 2,
      }}>
        OPERADOR
      </div>

      <HpBar current={playerHp} max={playerMaxHp} theme={t} />

      {playerBlock > 0 && (
        <div style={{ fontSize: 14, color: t.accent2 }}>
          🛡 {playerBlock === 9999 ? "∞" : playerBlock}
        </div>
      )}
      {reflect && (
        <div style={{ fontSize: 14, color: t.accent2 }}>🔄 Reflejo</div>
      )}
      {regenTurns > 0 && (
        <div style={{ fontSize: 14, color: "#33dd77" }}>🌿 Regen ({regenTurns})</div>
      )}
    </div>
  );
}
