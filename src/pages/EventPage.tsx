import { useState, useMemo } from "react";
import { EVENTS } from "../data/events";
import { SHOP_POOL, CARDS } from "../data/cards";
import type { ThemeTokens, GameState, EventChoice } from "../types";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onDone: (updated: GameState) => void;
}

export default function EventPage({ theme: t, gameState, onDone }: Props) {
  const event = useMemo(
    () => EVENTS[Math.floor(Math.random() * EVENTS.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [chosen, setChosen] = useState<EventChoice | null>(null);
  const [resultText, setResultText] = useState("");
  const [updatedState, setUpdatedState] = useState<GameState>(gameState);

  function choose(choice: EventChoice) {
    if (chosen) return;
    setChosen(choice);

    let state = { ...gameState };

    if (choice.effect.gold) {
      state = { ...state, gold: state.gold + choice.effect.gold };
    }
    if (choice.effect.damage) {
      state = { ...state, playerHp: Math.max(0, state.playerHp - choice.effect.damage) };
    }
    if (choice.effect.heal) {
      state = { ...state, playerHp: Math.min(state.playerMaxHp, state.playerHp + choice.effect.heal) };
    }
    if (choice.effect.cost && state.gold >= choice.effect.cost) {
      state = { ...state, gold: state.gold - choice.effect.cost };
      if (choice.effect.card) {
        const available = SHOP_POOL.filter(id => !state.deck.includes(id));
        if (available.length > 0) {
          const newCard = available[Math.floor(Math.random() * available.length)];
          state = { ...state, deck: [...state.deck, newCard] };
          setResultText(`${choice.result} (${CARDS[newCard].name})`);
          setUpdatedState(state);
          return;
        }
      }
    }

    setResultText(choice.result);
    setUpdatedState(state);
  }

  const btnBase: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: 2,
    fontFamily: t.bodyFont,
    fontSize: 14,
    cursor: chosen ? "default" : "pointer",
    transition: "opacity 0.15s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: t.bodyFont, color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      <div style={{
        maxWidth: 520, width: "90%",
        background: t.surface2, border: `2px solid ${t.border}`,
        borderRadius: 4,
        padding: "44px 40px",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        <div style={{ fontSize: 52, textAlign: "center" }}>{event.icon}</div>

        <div style={{
          fontFamily: t.titleFont, color: t.primary, fontSize: 20,
          textAlign: "center", letterSpacing: 3,
        }}>
          {event.title}
        </div>

        <div style={{
          color: t.textDim, fontSize: 14, lineHeight: 1.65,
          textAlign: "center", fontStyle: "italic",
        }}>
          {event.desc}
        </div>

        {!chosen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {event.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => choose(choice)}
                style={{
                  ...btnBase,
                  background: i === 0 ? t.buttonBg : "transparent",
                  border: `1px solid ${i === 0 ? t.buttonBorder : t.border}`,
                  color: t.text,
                  letterSpacing: 2,
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {chosen && (
          <>
            <div style={{
              background: t.surface1, border: `1px solid ${t.primary}`,
              borderRadius: 2, padding: "12px 16px",
              color: t.primary, fontSize: 14, textAlign: "center", lineHeight: 1.5,
            }}>
              {resultText}
            </div>
            <button
              onClick={() => onDone(updatedState)}
              style={{
                ...btnBase,
                background: t.buttonBg,
                border: `1px solid ${t.buttonBorder}`,
                color: t.text,
                fontFamily: t.titleFont,
                letterSpacing: 3,
              }}
            >
              AVANZAR ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
}
