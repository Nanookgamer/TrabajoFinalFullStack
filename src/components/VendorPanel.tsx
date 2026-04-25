/**
 * Panel lateral izquierdo de la tienda.
 * Muestra el avatar del vendedor robótico, una frase aleatoria
 * y la lista completa del mazo actual del jugador con sus iconos.
 */
import { CARDS } from "../data/cards";
import type { ThemeTokens } from "../types";

interface Props {
  vendorLine: string;  // Frase aleatoria seleccionada en ShopPage
  deck: string[];      // IDs de cartas del mazo actual
  diceCount: number;   // Número de dados que el jugador lanza por turno
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
      {/* Avatar del vendedor */}
      <div style={{ fontSize: 64 }}>🤖</div>

      {/* Frase del vendedor en un cuadro de texto */}
      <div style={{
        background: t.surface2, border: `1px solid ${t.border}`,
        borderRadius: 2, padding: "8px 10px",
        fontSize: 12, color: t.text, lineHeight: 1.5, textAlign: "center",
      }}>
        {vendorLine}
      </div>

      {/* Lista de cartas del mazo con su icono coloreado por tipo */}
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
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.text }}>
                {/* Icono coloreado según el tipo de la carta */}
                <span style={{ color: t.cardTypeColors[card.type] }}>{card.icon}</span>
                <span>{card.name}</span>
              </div>
            );
          })}
        </div>

        {/* Resumen: total de cartas y dados por turno */}
        <div style={{ marginTop: 8, fontSize: 11, color: t.textDim }}>
          {deck.length} cartas · {diceCount} dados/turno
        </div>
      </div>
    </div>
  );
}
