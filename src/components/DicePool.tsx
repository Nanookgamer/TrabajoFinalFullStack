/**
 * Sección de dados del combate.
 * Renderiza los dados del turno con sus puntos en SVG.
 * El jugador selecciona un dado para asignarlo a las cartas compatibles.
 * Muestra los botones de acción según la fase del turno:
 *   - "roll"       → botón LANZAR
 *   - "assign"     → botón FIN TURNO y dado seleccionado
 *   - "resolving"  → indicador PROCESANDO...
 */
import type { ThemeTokens, Phase } from "../types";

// Coordenadas (cx, cy) de cada punto según la cara del dado, en un viewBox de 48×48
const DOT_POS: Record<number, [number, number][]> = {
  1: [[24, 24]],
  2: [[16, 16], [32, 32]],
  3: [[16, 16], [24, 24], [32, 32]],
  4: [[16, 16], [32, 16], [16, 32], [32, 32]],
  5: [[16, 16], [32, 16], [24, 24], [16, 32], [32, 32]],
  6: [[16, 12], [32, 12], [16, 24], [32, 24], [16, 36], [32, 36]],
};

// Estado de un dado individual durante el turno
export interface DiceState {
  value: number;    // Valor lanzado (1–6)
  used: boolean;    // Ya fue asignado a alguna carta
  selected: boolean; // El jugador lo tiene seleccionado ahora mismo
}

interface Props {
  dice: DiceState[];
  phase: Phase;
  selectedVal: number | null;  // Valor del dado actualmente seleccionado
  activatedCount: number;      // Nº de cartas activadas (se muestra en "FIN TURNO")
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
      padding: "10px 16px",
      background: t.surface1, borderTop: `1px solid ${t.border}`,
      display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
    }}>
      {/* Etiqueta de la sección */}
      <div style={{ fontFamily: t.titleFont, fontSize: 12, color: t.textDim, letterSpacing: 1 }}>
        DICE POOL
      </div>

      {/* Lista de dados del turno */}
      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        {dice.map((die, i) => (
          <div
            key={i}
            onClick={() => onSelectDie(i)}
            style={{
              cursor: die.used || phase !== "assign" ? "default" : "pointer",
              opacity: die.used ? 0.3 : 1,
              // El dado seleccionado se eleva para resaltar que está activo
              transform: die.selected ? "scale(1.12) translateY(-4px)" : undefined,
              transition: "transform 0.15s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}
          >
            {/* SVG del dado: rectángulo redondeado + puntos según el valor */}
            <svg width="42" height="42" viewBox="0 0 48 48">
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
            <span style={{ fontSize: 11, color: t.textDim }}>{die.value}</span>
          </div>
        ))}
      </div>

      {/* Controles según la fase del turno */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        {/* Indicador del dado seleccionado en fase de asignación */}
        {phase === "assign" && (
          <div style={{ fontSize: 11, color: t.textDim }}>
            {selectedVal !== null ? `[${selectedVal}] seleccionado` : "SELECCIONA DADO"}
          </div>
        )}

        {/* Botón para lanzar los dados al inicio del turno */}
        {phase === "roll" && (
          <button onClick={onRoll} style={{
            padding: "8px 20px",
            background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
            borderRadius: 2, color: t.text, fontFamily: t.titleFont,
            fontSize: 13, letterSpacing: 2, cursor: "pointer",
          }}>
            ▶ LANZAR
          </button>
        )}

        {/* Botón para terminar el turno y resolver los efectos */}
        {phase === "assign" && (
          <button onClick={onEndTurn} style={{
            padding: "8px 20px",
            background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
            borderRadius: 2, color: t.text, fontFamily: t.titleFont,
            fontSize: 13, letterSpacing: 2, cursor: "pointer",
          }}>
            {`FIN TURNO [${activatedCount}]`}
          </button>
        )}

        {/* Mensaje animado mientras se resuelven los efectos de las cartas */}
        {phase === "resolving" && (
          <div style={{
            padding: "8px 20px",
            color: t.textDim, fontFamily: t.titleFont, fontSize: 13,
            animation: "pulse 1s infinite",
          }}>
            PROCESANDO...
          </div>
        )}
      </div>
    </div>
  );
}
