import { useRef } from "react";
import { useMatrixRain } from "../background/useMatrixRain";
import type { ThemeTokens, GameState } from "../types";

interface Props {
  theme: ThemeTokens;
  savedGame: GameState;
  onContinue: (saved: GameState) => void;
  onBack: () => void;
}

const FLOOR_LABELS = ["COMBATE I", "COMBATE II", "COMBATE III", "JEFE FINAL"];

export default function LoadGame({ theme: t, savedGame, onContinue, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const hpPct = Math.round((savedGame.playerHp / savedGame.playerMaxHp) * 100);

  const btnBase: React.CSSProperties = {
    width: "100%", padding: "11px 0",
    fontFamily: t.titleFont, fontSize: 13, letterSpacing: 3,
    cursor: "pointer", borderRadius: 2, transition: "opacity 0.15s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%",
      }}>
        <div style={{
          background: t.surface2,
          border: `2px solid ${t.border}`,
          borderRadius: 4,
          padding: "36px 32px",
          width: 360,
          animation: "fadeIn 0.35s ease-out",
        }}>

          {/* Cabecera */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              fontFamily: t.titleFont, color: t.textDim,
              fontSize: 11, letterSpacing: 5, marginBottom: 6,
            }}>
              DICE TACTICS
            </div>
            <div style={{
              fontFamily: t.titleFont, color: t.primary,
              fontSize: 20, letterSpacing: 4,
              textShadow: `0 0 20px ${t.primary}55`,
            }}>
              CARGAR PARTIDA
            </div>
          </div>

          {/* Progreso de pisos */}
          <div style={{
            background: t.surface1,
            border: `1px solid ${t.border}`,
            borderRadius: 3,
            padding: "14px 16px",
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: t.titleFont, color: t.textDim,
              fontSize: 10, letterSpacing: 3, marginBottom: 14,
            }}>
              PROGRESO
            </div>

            {/* Nodos de piso con línea conectora */}
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
              {/* Línea de fondo */}
              <div style={{
                position: "absolute", top: 13, left: 14, right: 14,
                height: 1, background: t.border, zIndex: 0,
              }} />

              {FLOOR_LABELS.map((label, i) => {
                const done    = i < savedGame.floor;
                const current = i === savedGame.floor;
                const color   = done ? t.primary : current ? t.accent2 : t.border;
                return (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    flex: 1, zIndex: 1,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: `2px solid ${color}`,
                      background: done ? `${t.primary}22` : current ? `${t.accent2}22` : t.surface1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color,
                      fontFamily: t.titleFont,
                      boxShadow: current ? `0 0 10px ${t.accent2}66` : "none",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <div style={{
                      fontFamily: t.titleFont, fontSize: 8, marginTop: 6,
                      color: current ? t.accent2 : done ? t.primary : t.textDim,
                      letterSpacing: 0.5, textAlign: "center", lineHeight: 1.3,
                    }}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats de la partida */}
          <div style={{
            background: t.surface1,
            border: `1px solid ${t.border}`,
            borderRadius: 3,
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <div style={{
              fontFamily: t.titleFont, color: t.textDim,
              fontSize: 10, letterSpacing: 3, marginBottom: 2,
            }}>
              ESTADO DEL HÉROE
            </div>

            {/* Barra de vida */}
            <div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: t.bodyFont, fontSize: 13, color: t.textDim, marginBottom: 4,
              }}>
                <span>❤ VIDA</span>
                <span style={{ color: t.text }}>{savedGame.playerHp} / {savedGame.playerMaxHp}</span>
              </div>
              <div style={{
                height: 6, background: t.hpBg, borderRadius: 3,
                overflow: "hidden", border: `1px solid ${t.border}`,
              }}>
                <div style={{
                  height: "100%", width: `${hpPct}%`,
                  background: hpPct > 50 ? t.hpColor : t.accent,
                  borderRadius: 3, transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* Grid de stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {[
                { icon: "◈", label: "ORO",   value: savedGame.gold },
                { icon: "▣", label: "CARTAS", value: savedGame.deck.length },
                { icon: "⬡", label: "DADOS",  value: savedGame.diceCount },
                { icon: "↺", label: "TURNOS", value: savedGame.totalTurns },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontFamily: t.bodyFont, fontSize: 13, color: t.textDim }}>
                    {icon} {label}
                  </span>
                  <span style={{
                    fontFamily: t.titleFont, fontSize: 13, color: t.primary, letterSpacing: 1,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              style={{
                ...btnBase,
                background: t.buttonBg,
                border: `1px solid ${t.buttonBorder}`,
                color: t.text,
              }}
              onClick={() => onContinue(savedGame)}
            >
              CONTINUAR PARTIDA
            </button>
            <button
              style={{
                ...btnBase,
                background: "transparent",
                border: `1px solid ${t.border}`,
                color: t.textDim,
              }}
              onClick={onBack}
            >
              VOLVER AL MENÚ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
