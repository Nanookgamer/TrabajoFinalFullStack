/**
 * Mano de cartas del jugador en la pantalla de combate (fila inferior).
 * Cada carta muestra su requisito de dado, icono, nombre y descripción.
 *
 * Comportamiento visual:
 *   - Compatible con el dado seleccionado → borde primary, se eleva ligeramente.
 *   - Activada (dado asignado) → borde del color del tipo, sube más arriba.
 *   - Incompatible con el dado seleccionado → opacidad reducida.
 */
import { checkRequirement } from "../data/cards";
import type { ThemeTokens, Card, Phase } from "../types";

// Extiende Card con el estado de UI del turno actual
export interface HandCard extends Card {
  activated: boolean;         // La carta fue activada con un dado en este turno
  assignedDie: number | null; // Valor del dado asignado (null si no está activada)
}

interface Props {
  hand: HandCard[];
  selectedVal: number | null; // Valor del dado que el jugador tiene seleccionado
  phase: Phase;
  onActivateCard: (i: number) => void;
  theme: ThemeTokens;
}

// Convierte el requisito de dado a un texto corto y legible
function reqLabel(req: Card["req"]): string {
  switch (req.type) {
    case "even":  return "PAR";
    case "odd":   return "IMPAR";
    case "exact": return `= ${req.value}`;
    case "range": return `${req.min} – ${req.max}`;
  }
}

export default function CardHand({ hand, selectedVal, phase, onActivateCard, theme: t }: Props) {
  return (
    <div style={{
      padding: "8px 16px",
      borderTop: `1px solid ${t.border}`,
      display: "flex", gap: 8, overflowX: "auto", flexShrink: 0,
      background: t.bg,
    }}>
      {hand.map((card, ci) => {
        const typeColor = t.cardTypeColors[card.type];

        // Solo es compatible si hay un dado seleccionado, cumple el requisito y no está activada
        const isCompatible =
          selectedVal !== null && checkRequirement(card.req, selectedVal) && !card.activated;
        const isActivated = card.activated;
        // Se atenúa si hay un dado seleccionado pero esta carta no es válida para él
        const isDimmed = selectedVal !== null && !isCompatible && !isActivated;

        return (
          <div
            key={ci}
            onClick={() => onActivateCard(ci)}
            style={{
              minWidth: 100, maxWidth: 100,
              background: t.cardBg,
              // El color del borde indica el estado de la carta
              border: `1.5px solid ${isActivated ? typeColor : (isCompatible ? t.primary : t.border)}`,
              borderRadius: 2,
              padding: "8px 6px",
              cursor: phase === "assign" && isCompatible ? "pointer" : "default",
              opacity: isDimmed ? 0.38 : 1,
              // Desplazamiento vertical según el estado
              transform: isActivated
                ? "translateY(-10px) scale(1.04)"
                : (isCompatible ? "translateY(-3px)" : undefined),
              transition: "transform 0.15s, opacity 0.15s",
              // Brillo de contorno al activar la carta
              boxShadow: isActivated ? `0 0 12px ${typeColor}66` : undefined,
              display: "flex", flexDirection: "column", gap: 4, flexShrink: 0,
            }}
          >
            {/* Franja de color en la parte superior según el tipo de carta */}
            <div style={{ height: 4, background: typeColor, borderRadius: 2 }} />

            {/* Requisito de dado */}
            <div style={{
              fontSize: 9, color: typeColor,
              fontFamily: t.titleFont, letterSpacing: 1, textAlign: "center",
            }}>
              {reqLabel(card.req)}
            </div>

            {/* Icono representativo de la carta */}
            <div style={{ fontSize: 16, textAlign: "center" }}>{card.icon}</div>

            {/* Nombre de la carta */}
            <div style={{
              fontSize: 10, color: t.text,
              fontFamily: t.titleFont, textAlign: "center", lineHeight: 1.2,
            }}>
              {card.name}
            </div>

            {/* Descripción corta del efecto */}
            <div style={{ fontSize: 9, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
              {card.desc}
            </div>

            {/* Confirmación del dado asignado si la carta está activada */}
            {isActivated && (
              <div style={{ textAlign: "center", fontSize: 9, color: typeColor }}>
                🎲 {card.assignedDie} ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
