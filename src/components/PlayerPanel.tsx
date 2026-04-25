/**
 * Panel del jugador en la pantalla de combate (columna izquierda).
 * Muestra el avatar, la barra de vida y los estados de buff activos:
 * bloque de daño (🛡️), reflejo (🔄) y regeneración por turno (🌿).
 * Se anima cuando el jugador recibe daño gracias al keyframe "playerHit" de styles.css.
 */
import HpBar from "./HpBar";
import type { ThemeTokens } from "../types";

interface Props {
  playerHp: number;
  playerMaxHp: number;
  playerBlock: number;   // 9999 = bloque infinito (escudo mágico)
  reflect: boolean;
  regenTurns: number;
  isHit: boolean;        // true durante la animación de recibir daño
  theme: ThemeTokens;
}

export default function PlayerPanel({
  playerHp, playerMaxHp, playerBlock, reflect, regenTurns, isHit, theme: t,
}: Props) {
  return (
    <div style={{
      width: 160, flexShrink: 0,
      background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
      padding: "12px 10px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      // Sacudida lateral al recibir daño (keyframe "playerHit" en styles.css)
      animation: isHit ? "playerHit 0.4s ease-out" : undefined,
    }}>
      {/* Avatar del jugador */}
      <div style={{ fontSize: 52 }}>🧙</div>

      {/* Etiqueta de nombre */}
      <div style={{ fontFamily: t.titleFont, fontSize: 11, color: t.primary, textAlign: "center", letterSpacing: 1 }}>
        OPERADOR
      </div>

      {/* Barra de puntos de vida */}
      <HpBar current={playerHp} max={playerMaxHp} theme={t} />

      {/* Estados de buff — solo se renderizan cuando están activos */}
      {playerBlock > 0 && (
        <div style={{ fontSize: 12, color: t.accent2 }}>
          🛡️ {playerBlock === 9999 ? "∞" : playerBlock}
        </div>
      )}
      {reflect && (
        <div style={{ fontSize: 12, color: t.accent2 }}>🔄 Reflejo</div>
      )}
      {regenTurns > 0 && (
        <div style={{ fontSize: 12, color: "#33dd77" }}>🌿 Regen ({regenTurns})</div>
      )}
    </div>
  );
}
