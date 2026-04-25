/**
 * Panel del enemigo en la pantalla de combate (columna derecha).
 * Muestra el avatar según el piso, la barra de vida, el daño por turno
 * y el contador de turnos de veneno activo.
 * Se anima cuando el enemigo recibe daño gracias al keyframe "enemyHit" de styles.css.
 */
import HpBar from "./HpBar";
import type { ThemeTokens, Enemy } from "../types";

interface Props {
  enemyHp: number;
  enemy: Enemy;
  floor: number;     // Piso actual (0–3), determina el avatar
  poisonTurns: number;
  isHit: boolean;    // true durante la animación de recibir daño
  theme: ThemeTokens;
}

// Emoji de avatar para cada piso: Slime (0), Golem (1), Brujo (2), Jefe (3)
const ENEMY_AVATARS = ["🫧", "🗿", "🧙‍♂️", "🐉"];

export default function EnemyPanel({
  enemyHp, enemy, floor, poisonTurns, isHit, theme: t,
}: Props) {
  return (
    <div style={{
      width: 160, flexShrink: 0,
      background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
      padding: "12px 10px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      // Sacudida lateral al recibir daño (keyframe "enemyHit" en styles.css)
      animation: isHit ? "enemyHit 0.4s ease-out" : undefined,
    }}>
      {/* Avatar del enemigo según el piso actual */}
      <div style={{ fontSize: 52 }}>
        {ENEMY_AVATARS[Math.min(floor, 3)]}
      </div>

      {/* Nombre del enemigo */}
      <div style={{ fontFamily: t.titleFont, fontSize: 11, color: t.accent, textAlign: "center", letterSpacing: 1 }}>
        {enemy.name}
      </div>

      {/* Barra de puntos de vida */}
      <HpBar current={enemyHp} max={enemy.maxHp} theme={t} />

      {/* Daño base que inflige cada turno */}
      <div style={{ fontSize: 12, color: t.textDim }}>⚔️ {enemy.attack} atk/turno</div>

      {/* Contador de turnos de veneno restantes */}
      {poisonTurns > 0 && (
        <div style={{ fontSize: 12, color: "#aa44ff" }}>☠️ Veneno ({poisonTurns})</div>
      )}
    </div>
  );
}
