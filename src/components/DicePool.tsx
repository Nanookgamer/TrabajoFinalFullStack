import type { ThemeTokens, Phase } from "../types";

const DOT_POS: Record<number, [number, number][]> = {
  1: [[24, 24]],
  2: [[16, 16], [32, 32]],
  3: [[16, 16], [24, 24], [32, 32]],
  4: [[16, 16], [32, 16], [16, 32], [32, 32]],
  5: [[16, 16], [32, 16], [24, 24], [16, 32], [32, 32]],
  6: [[16, 12], [32, 12], [16, 24], [32, 24], [16, 36], [32, 36]],
};

export interface DiceState {
  value: number;
  used: boolean;
  selected: boolean;
}

interface Props {
  dice: DiceState[];
  phase: Phase;
  selectedVal: number | null;
  activatedCount: number;
  onSelectDie: (i: number) => void;
  onRoll: () => void;
  onEndTurn: () => void;
  theme: ThemeTokens;
}

export default function DicePool({
  dice, phase, selectedVal, activatedCount, onSelectDie, onRoll, onEndTurn, theme: t,
}: Props) {
  return (
    <div style={{
      padding: "14px 20px",
      background: t.surface1, borderTop: `1px solid ${t.border}`,
      display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
    }}>
      <div style={{ fontFamily: t.titleFont, fontSize: 13, color: t.textDim, letterSpacing: 2 }}>
        DICE POOL
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        {dice.map((die, i) => (
          <div
            key={i}
            onClick={() => onSelectDie(i)}
            style={{
              cursor: die.used || phase !== "assign" ? "default" : "pointer",
              opacity: die.used ? 0.3 : 1,
              transform: die.selected ? "scale(1.15) translateY(-5px)" : undefined,
              transition: "transform 0.15s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}
          >
            <svg width="54" height="54" viewBox="0 0 48 48">
              <rect x="2" y="2" width="44" height="44" rx="8"
                fill={t.cardBg}
                stroke={die.selected ? t.primary : (die.used ? "#555" : t.border)}
                strokeWidth={die.selected ? 3.5 : 1.5}
                style={die.selected ? { filter: `drop-shadow(0 0 6px ${t.primary})` } : undefined}
              />
              {(DOT_POS[die.value] ?? []).map(([cx, cy], di) => (
                <circle key={di} cx={cx} cy={cy} r={4} fill={t.diceColor} />
              ))}
            </svg>
            <span style={{ fontSize: 13, color: t.textDim }}>{die.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
        {phase === "assign" && (
          <div style={{ fontSize: 13, color: t.textDim }}>
            {selectedVal !== null ? `[${selectedVal}] seleccionado` : "SELECCIONA DADO"}
          </div>
        )}

        {phase === "roll" && (
          <button onClick={onRoll} style={{
            padding: "10px 28px",
            background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
            borderRadius: 2, color: t.text, fontFamily: t.titleFont,
            fontSize: 14, letterSpacing: 2, cursor: "pointer",
          }}>
            ▶ LANZAR
          </button>
        )}

        {phase === "assign" && (
          <button onClick={onEndTurn} style={{
            padding: "10px 28px",
            background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
            borderRadius: 2, color: t.text, fontFamily: t.titleFont,
            fontSize: 14, letterSpacing: 2, cursor: "pointer",
          }}>
            {`FIN TURNO [${activatedCount}]`}
          </button>
        )}

        {phase === "resolving" && (
          <div style={{
            padding: "10px 28px",
            color: t.textDim, fontFamily: t.titleFont, fontSize: 14,
            animation: "pulse 1s infinite",
          }}>
            PROCESANDO...
          </div>
        )}
      </div>
    </div>
  );
}
