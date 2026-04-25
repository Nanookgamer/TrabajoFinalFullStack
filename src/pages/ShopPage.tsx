import { useState, useMemo } from "react";
import { CARDS, SHOP_POOL, cardPrice } from "../data/cards";
import type { ThemeTokens, GameState, Card } from "../types";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onDone: (updated: GameState) => void;
}

interface ShopItem {
  card: Card;
  price: number;
  bought: boolean;
}

const MAX_DICE = 8;
const DICE_UPGRADE_PRICE = 18;

export default function ShopPage({ theme: t, gameState, onDone }: Props) {
  const shopItems = useMemo<ShopItem[]>(() => {
    const available = SHOP_POOL.filter(id => !gameState.deck.includes(id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(id => ({
      card: CARDS[id],
      price: cardPrice(CARDS[id]),
      bought: false,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [gold, setGold] = useState(gameState.gold);
  const [deck, setDeck] = useState(gameState.deck);
  const [diceCount, setDiceCount] = useState(gameState.diceCount);
  const [items, setItems] = useState(shopItems);
  const [diceUpgradeBought, setDiceUpgradeBought] = useState(false);
  const [vendorLine] = useState(() => {
    const lines = [
      "UNIDAD MERCANTIL-7 EN LÍNEA. Inventario disponible.",
      "Procesando catálogo... Ofertas óptimas calculadas.",
      "Transacción segura garantizada.",
      "Datos = poder. ¿Adquieres protocolos nuevos?",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  });

  function buyCard(i: number) {
    const item = items[i];
    if (item.bought || gold < item.price) return;
    setGold(g => g - item.price);
    setDeck(d => [...d, item.card.id]);
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, bought: true } : it));
  }

  function buyDiceUpgrade() {
    if (diceUpgradeBought || diceCount >= MAX_DICE || gold < DICE_UPGRADE_PRICE) return;
    setGold(g => g - DICE_UPGRADE_PRICE);
    setDiceCount(d => d + 1);
    setDiceUpgradeBought(true);
  }

  const typeColor = (type: string) => t.cardTypeColors[type as keyof typeof t.cardTypeColors] ?? t.primary;

  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", flexDirection: "column",
      fontFamily: t.bodyFont, color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 24px",
        background: t.surface1, borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 16, letterSpacing: 3 }}>
          ▣ MERCADO DIGITAL
        </div>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 14 }}>🪙 {gold}</div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left: Vendor + deck */}
        <div style={{
          width: 200, flexShrink: 0,
          background: t.surface1, borderRight: `1px solid ${t.border}`,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "20px 12px", gap: 12, overflowY: "auto",
        }}>
          <div style={{ fontSize: 64 }}>🤖</div>

          <div style={{
            background: t.surface2, border: `1px solid ${t.border}`,
            borderRadius: 2, padding: "8px 10px",
            fontSize: 12, color: t.text, lineHeight: 1.5, textAlign: "center",
          }}>
            {vendorLine}
          </div>

          <div style={{ width: "100%", marginTop: 8 }}>
            <div style={{ fontFamily: t.titleFont, fontSize: 11, color: t.textDim, marginBottom: 8, letterSpacing: 1 }}>
              MAZO
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {deck.map((id, i) => {
                const card = CARDS[id];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.text }}>
                    <span style={{ color: typeColor(card.type) }}>{card.icon}</span>
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

        {/* Right: Shop cards */}
        <div style={{
          flex: 1, padding: "20px 24px",
          display: "flex", flexWrap: "wrap", gap: 16,
          alignContent: "flex-start", overflowY: "auto",
        }}>
          {items.map((item, i) => {
            const inDeck = gameState.deck.includes(item.card.id);
            const canBuy = !item.bought && gold >= item.price;
            const tc = typeColor(item.card.type);

            return (
              <div
                key={i}
                onClick={() => buyCard(i)}
                style={{
                  width: 150,
                  background: t.cardBg,
                  border: `1.5px solid ${item.bought ? t.border : (canBuy ? tc : t.border)}`,
                  borderRadius: 2,
                  padding: "10px 8px",
                  cursor: canBuy ? "pointer" : "default",
                  opacity: item.bought ? 0.55 : (gold < item.price ? 0.42 : 1),
                  display: "flex", flexDirection: "column", gap: 6,
                }}
              >
                <div style={{
                  background: t.surface2, borderRadius: 2,
                  padding: "2px 6px", fontSize: 11, textAlign: "center",
                  color: item.bought ? "#44cc66" : (gold < item.price ? t.textDim : t.primary),
                  fontFamily: t.titleFont,
                }}>
                  {item.bought ? "✓ Comprada" : (inDeck ? `🪙 ${item.price} (ya en mazo)` : `🪙 ${item.price}`)}
                </div>
                <div style={{ height: 3, background: tc }} />
                <div style={{ fontSize: 9, color: tc, fontFamily: t.titleFont, letterSpacing: 1, textAlign: "center" }}>
                  {item.card.type.toUpperCase()}
                </div>
                <div style={{ fontSize: 28, textAlign: "center" }}>{item.card.icon}</div>
                <div style={{ fontSize: 11, color: t.text, fontFamily: t.titleFont, textAlign: "center" }}>
                  {item.card.name}
                </div>
                <div style={{ fontSize: 9, color: t.primary, textAlign: "center" }}>
                  {item.card.reqLabel}
                </div>
                <div style={{ fontSize: 10, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
                  {item.card.desc}
                </div>
              </div>
            );
          })}

          {/* Dice upgrade */}
          {diceCount < MAX_DICE && (
            <div
              onClick={buyDiceUpgrade}
              style={{
                width: 150,
                background: t.cardBg,
                border: `1.5px solid ${diceUpgradeBought ? t.border : (gold >= DICE_UPGRADE_PRICE ? t.primary : t.border)}`,
                borderRadius: 2,
                padding: "10px 8px",
                cursor: (!diceUpgradeBought && gold >= DICE_UPGRADE_PRICE) ? "pointer" : "default",
                opacity: diceUpgradeBought ? 0.55 : (gold < DICE_UPGRADE_PRICE ? 0.42 : 1),
                display: "flex", flexDirection: "column", gap: 6,
              }}
            >
              <div style={{
                background: t.surface2, borderRadius: 2,
                padding: "2px 6px", fontSize: 11, textAlign: "center",
                color: diceUpgradeBought ? "#44cc66" : t.primary, fontFamily: t.titleFont,
              }}>
                {diceUpgradeBought ? "✓ Comprado" : `🪙 ${DICE_UPGRADE_PRICE}`}
              </div>
              <div style={{ height: 3, background: t.primary }} />
              <div style={{ fontSize: 9, color: t.primary, fontFamily: t.titleFont, letterSpacing: 1, textAlign: "center" }}>
                ESPECIAL 🎲
              </div>
              <div style={{ fontSize: 28, textAlign: "center" }}>🎲</div>
              <div style={{ fontSize: 11, color: t.text, fontFamily: t.titleFont, textAlign: "center" }}>
                Dado Extra
              </div>
              <div style={{ fontSize: 10, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
                {diceCount} → {diceCount + 1} dados por turno
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue */}
      <div style={{
        padding: "16px", textAlign: "center",
        background: t.surface1, borderTop: `1px solid ${t.border}`,
      }}>
        <button
          onClick={() => onDone({ ...gameState, gold, deck, diceCount })}
          style={{
            padding: "12px 40px",
            background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
            borderRadius: 2, color: t.text, fontFamily: t.titleFont,
            fontSize: 14, letterSpacing: 3, cursor: "pointer",
          }}
        >
          AVANZAR ▶
        </button>
      </div>
    </div>
  );
}
