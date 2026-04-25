/**
 * Tienda entre combates de Dice Tactics.
 *
 * Aparece en los pisos impares (1 y 3) después de ganar un combate.
 * Ofrece 4 cartas aleatorias del SHOP_POOL (que no estén ya en el mazo)
 * y la opción de comprar un dado extra (máximo 8 dados en total).
 *
 * El estado de oro, mazo y dados se gestiona localmente y se devuelve
 * al componente padre (Game.tsx) al pulsar "AVANZAR".
 */
import { useState, useMemo } from "react";
import { CARDS, SHOP_POOL, cardPrice } from "../data/cards";
import type { ThemeTokens, GameState } from "../types";
import ShopCard from "../components/ShopCard";
import type { ShopItem } from "../components/ShopCard";
import VendorPanel from "../components/VendorPanel";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onDone: (updated: GameState) => void;
}

// Límite de dados permitidos (más de 8 haría la interfaz demasiado ancha)
const MAX_DICE          = 8;
const DICE_UPGRADE_PRICE = 18;

export default function ShopPage({ theme: t, gameState, onDone }: Props) {
  // Genera los artículos de la tienda una sola vez al montar el componente
  // (useMemo con array vacío garantiza que no se regeneran en cada re-render)
  const shopItems = useMemo<ShopItem[]>(() => {
    const available = SHOP_POOL.filter(id => !gameState.deck.includes(id));
    const shuffled  = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(id => ({
      card:  CARDS[id],
      price: cardPrice(CARDS[id]),
      bought: false,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Estado local de la compra ────────────────────────────────────────────────
  const [gold,              setGold]              = useState(gameState.gold);
  const [deck,              setDeck]              = useState(gameState.deck);
  const [diceCount,         setDiceCount]         = useState(gameState.diceCount);
  const [items,             setItems]             = useState(shopItems);
  const [diceUpgradeBought, setDiceUpgradeBought] = useState(false);

  // Frase aleatoria del vendedor (se fija al montar para que no cambie)
  const [vendorLine] = useState(() => {
    const lines = [
      "UNIDAD MERCANTIL-7 EN LÍNEA. Inventario disponible.",
      "Procesando catálogo... Ofertas óptimas calculadas.",
      "Transacción segura garantizada.",
      "Datos = poder. ¿Adquieres protocolos nuevos?",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  });

  // ── Acciones de compra ───────────────────────────────────────────────────────

  // Compra una carta de la tienda si el jugador tiene suficiente oro
  function buyCard(i: number) {
    const item = items[i];
    if (item.bought || gold < item.price) return;
    setGold(g => g - item.price);
    setDeck(d => [...d, item.card.id]);
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, bought: true } : it));
  }

  // Compra un dado extra (solo uno por visita a la tienda)
  function buyDiceUpgrade() {
    if (diceUpgradeBought || diceCount >= MAX_DICE || gold < DICE_UPGRADE_PRICE) return;
    setGold(g => g - DICE_UPGRADE_PRICE);
    setDiceCount(d => d + 1);
    setDiceUpgradeBought(true);
  }

  // Color del tipo de carta para usarlo en los componentes ShopCard
  const typeColor = (type: string) =>
    t.cardTypeColors[type as keyof typeof t.cardTypeColors] ?? t.primary;

  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", flexDirection: "column",
      fontFamily: t.bodyFont, color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      {/* ── Header: título y oro actual ── */}
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

      {/* ── Contenido principal: panel vendedor + cartas disponibles ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Panel izquierdo: vendedor y mazo actual */}
        <VendorPanel
          vendorLine={vendorLine}
          deck={deck}
          diceCount={diceCount}
          theme={t}
        />

        {/* Grid de artículos disponibles para comprar */}
        <div style={{
          flex: 1, padding: "20px 24px",
          display: "flex", flexWrap: "wrap", gap: 16,
          alignContent: "flex-start", overflowY: "auto",
        }}>
          {/* Cartas de la tienda */}
          {items.map((item, i) => (
            <ShopCard
              key={i}
              item={item}
              gold={gold}
              inDeck={gameState.deck.includes(item.card.id)}
              onBuy={() => buyCard(i)}
              typeColor={typeColor(item.card.type)}
              theme={t}
            />
          ))}

          {/* Mejora de dado extra (solo visible si aún no se alcanzó el máximo) */}
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
              {/* Precio o estado de compra */}
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
              {/* Muestra la transición de dados actual → nuevo */}
              <div style={{ fontSize: 10, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
                {diceCount} → {diceCount + 1} dados por turno
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Pie de página: botón para avanzar al siguiente combate ── */}
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
