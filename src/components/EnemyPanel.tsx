import HpBar from "./HpBar";
import type { ThemeTokens, Enemy } from "../types";

interface Props {
  enemyHp: number;
  enemy: Enemy;
  poisonTurns: number;
  isHit: boolean;
  theme: ThemeTokens;
}

export default function EnemyPanel({ enemyHp, enemy, poisonTurns, isHit, theme: t }: Props) {
  return (
    <div style={{
      width: 210, flexShrink: 0,
      background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
      padding: "16px 12px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      animation: isHit ? "enemyHit 0.4s ease-out" : undefined,
    }}>
      <img
        src={`/img/${enemy.image}`}
        alt={enemy.name}
        style={{
          width: 120, height: 120,
          objectFit: "contain",
          imageRendering: "pixelated",
          filter: enemy.isBoss ? `drop-shadow(0 0 10px ${t.accent})` : undefined,
        }}
      />

      <div style={{
        fontFamily: t.titleFont, fontSize: 13,
        color: enemy.isBoss ? t.accent : t.primary,
        textAlign: "center", letterSpacing: 2,
      }}>
        {enemy.isBoss && <span style={{ marginRight: 4 }}>⚠</span>}
        {enemy.name}
      </div>

      <HpBar current={enemyHp} max={enemy.maxHp} theme={t} />

      <div style={{ fontSize: 13, color: t.textDim }}>⚔ {enemy.attack} atk/turno</div>

      {poisonTurns > 0 && (
        <div style={{ fontSize: 13, color: "#aa44ff" }}>☠ Veneno ({poisonTurns})</div>
      )}
    </div>
  );
}
