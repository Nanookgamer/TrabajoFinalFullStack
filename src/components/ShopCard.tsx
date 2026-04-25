/**
 * Carta de producto en la tienda del juego.
 * Muestra el precio, el tipo, el icono y la descripción de la carta.
 * El borde se ilumina si el jugador puede permitírsela.
 * La opacidad se reduce si ya fue comprada o si el jugador no tiene suficiente oro.
 */
import type { ThemeTokens, Card } from "../types";

// Datos de un artículo disponible en la tienda
export interface ShopItem {
  card: Card;
  price: number;
  bought: boolean; // true si el jugador ya la compró en esta visita
}

interface Props {
  item: ShopItem;
  gold: number;    // Oro actual del jugador (para saber si puede comprar)
  inDeck: boolean; // La carta ya estaba en el mazo antes de entrar a la tienda
  onBuy: () => void;
  typeColor: string; // Color del tipo de carta (ataque, defensa, etc.)
  theme: ThemeTokens;
}

export default function ShopCard({ item, gold, inDeck, onBuy, typeColor, theme: t }: Props) {
  const canBuy = !item.bought && gold >= item.price;

  return (
    <div
      onClick={onBuy}
      style={{
        width: 150,
        background: t.cardBg,
        // El borde resalta con el color del tipo si se puede comprar
        border: `1.5px solid ${item.bought ? t.border : (canBuy ? typeColor : t.border)}`,
        borderRadius: 2,
        padding: "10px 8px",
        cursor: canBuy ? "pointer" : "default",
        // Atenuado si ya comprada o sin oro
        opacity: item.bought ? 0.55 : (gold < item.price ? 0.42 : 1),
        display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      {/* Precio / estado de compra */}
      <div style={{
        background: t.surface2, borderRadius: 2,
        padding: "2px 6px", fontSize: 11, textAlign: "center",
        color: item.bought ? "#44cc66" : (gold < item.price ? t.textDim : t.primary),
        fontFamily: t.titleFont,
      }}>
        {item.bought
          ? "✓ Comprada"
          : inDeck
            ? `🪙 ${item.price} (ya en mazo)`
            : `🪙 ${item.price}`}
      </div>

      {/* Franja de color del tipo */}
      <div style={{ height: 3, background: typeColor }} />

      {/* Etiqueta del tipo de carta */}
      <div style={{ fontSize: 9, color: typeColor, fontFamily: t.titleFont, letterSpacing: 1, textAlign: "center" }}>
        {item.card.type.toUpperCase()}
      </div>

      {/* Icono grande de la carta */}
      <div style={{ fontSize: 28, textAlign: "center" }}>{item.card.icon}</div>

      {/* Nombre de la carta */}
      <div style={{ fontSize: 11, color: t.text, fontFamily: t.titleFont, textAlign: "center" }}>
        {item.card.name}
      </div>

      {/* Requisito de dado (calculado previamente en cards.ts) */}
      <div style={{ fontSize: 9, color: t.primary, textAlign: "center" }}>
        {item.card.reqLabel}
      </div>

      {/* Descripción del efecto */}
      <div style={{ fontSize: 10, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
        {item.card.desc}
      </div>
    </div>
  );
}
