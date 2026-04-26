import { checkRequirement } from "../data/cards";
import type { ThemeTokens, Card, Phase } from "../types";

export interface HandCard extends Card {
  activated: boolean;
  assignedDie: number | null;
}

interface Props {
  hand: HandCard[];
  selectedVal: number | null;
  phase: Phase;
  onActivateCard: (i: number) => void;
  theme: ThemeTokens;
}

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
      padding: "12px 20px",
      borderTop: `1px solid ${t.border}`,
      display: "flex", gap: 12, overflowX: "auto", flexShrink: 0,
      background: t.bg,
    }}>
      {hand.map((card, ci) => {
        const typeColor   = t.cardTypeColors[card.type];
        const isCompatible =
          selectedVal !== null && checkRequirement(card.req, selectedVal) && !card.activated;
        const isActivated = card.activated;
        const isDimmed    = selectedVal !== null && !isCompatible && !isActivated;

        return (
          <div
            key={ci}
            onClick={() => onActivateCard(ci)}
            style={{
              minWidth: 130, maxWidth: 130,
              background: t.cardBg,
              border: `1.5px solid ${isActivated ? typeColor : (isCompatible ? t.primary : t.border)}`,
              borderRadius: 2,
              padding: "10px 8px",
              cursor: phase === "assign" && isCompatible ? "pointer" : "default",
              opacity: isDimmed ? 0.38 : 1,
              transform: isActivated
                ? "translateY(-12px) scale(1.04)"
                : (isCompatible ? "translateY(-4px)" : undefined),
              transition: "transform 0.15s, opacity 0.15s",
              boxShadow: isActivated ? `0 0 14px ${typeColor}66` : undefined,
              display: "flex", flexDirection: "column", gap: 5, flexShrink: 0,
            }}
          >
            <div style={{ height: 4, background: typeColor, borderRadius: 2 }} />

            <div style={{
              fontSize: 11, color: typeColor,
              fontFamily: t.titleFont, letterSpacing: 1, textAlign: "center",
            }}>
              {reqLabel(card.req)}
            </div>

            <div style={{ fontSize: 22, textAlign: "center" }}>{card.icon}</div>

            <div style={{
              fontSize: 12, color: t.text,
              fontFamily: t.titleFont, textAlign: "center", lineHeight: 1.2,
            }}>
              {card.name}
            </div>

            <div style={{ fontSize: 11, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
              {card.desc}
            </div>

            {isActivated && (
              <div style={{ textAlign: "center", fontSize: 11, color: typeColor }}>
                🎲 {card.assignedDie} ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
