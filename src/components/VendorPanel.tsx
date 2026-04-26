import { CARDS } from "../data/cards";
import type { ThemeTokens } from "../types";

interface Props {
  vendorLine: string;
  deck: string[];
  diceCount: number;
  theme: ThemeTokens;
}

export default function VendorPanel({ vendorLine, deck, diceCount, theme: t }: Props) {
  return (
    <div style={{
      width: 200, flexShrink: 0,
      background: t.surface1, borderRight: `1px solid ${t.border}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 12px", gap: 12, overflowY: "auto",
    }}>
      <img
        src="/img/shopkeeper/shopkeeper.png"
        alt="Vendedor"
        style={{
          width: 80, height: 80,
          objectFit: "contain",
          imageRendering: "pixelated",
          filter: `drop-shadow(0 0 8px ${t.primary}55)`,
        }}
      />

      <div style={{
        background: t.surface2, border: `1px solid ${t.border}`,
        borderRadius: 2, padding: "8px 10px",
        fontSize: 12, color: t.text, lineHeight: 1.5, textAlign: "center",
      }}>
        {vendorLine}
      </div>

      <div style={{ width: "100%", marginTop: 8 }}>
        <div style={{
          fontFamily: t.titleFont, fontSize: 11,
          color: t.textDim, marginBottom: 8, letterSpacing: 1,
        }}>
          MAZO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {deck.map((id, i) => {
            const card = CARDS[id];
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 11, color: t.text,
              }}>
                <span style={{ color: t.cardTypeColors[card.type] }}>{card.icon}</span>
                <span>{card.name}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: t.textDim }}>
          {deck.length} cartas · {diceCount} dados/turno
        </div>
      </div>
    </div>
  );
}
