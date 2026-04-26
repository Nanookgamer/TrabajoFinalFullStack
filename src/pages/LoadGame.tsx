/**
 * Pantalla de selección de partidas guardadas.
 *
 * Muestra los 3 slots de guardado del usuario. Para cada slot:
 *   - Si tiene datos: muestra progreso de pisos, vida, oro, cartas, dados y turnos.
 *     Botones: CARGAR (carga la partida) y 🗑 (borrado en dos pasos).
 *   - Si está vacío: muestra "+ NUEVA PARTIDA" con el GameState inicial.
 *
 * El borrado en dos pasos evita eliminar partidas accidentalmente:
 * el primer click muestra "BORRAR / ✕" y el segundo confirma la acción.
 *
 * Los subcomponentes SlotSkeleton y SlotCard se definen dentro del componente
 * para poder acceder al estilo `btn` sin prop-drilling.
 */
import { useRef, useState, useEffect } from "react";
import { useMatrixRain } from "../background/useMatrixRain";
import { apiGetSaves, apiDeleteSave } from "../services/api";
import type { SavedSlot } from "../services/api";
import type { ThemeTokens, GameState } from "../types";

interface Props {
  theme: ThemeTokens;
  onStartGame: (state: GameState, slot: number) => void;
  onBack: () => void;
}

const FLOOR_LABELS = ["COMBATE I", "COMBATE II", "COMBATE III", "JEFE FINAL"];

const STARTING_STATE: Omit<GameState, "_won"> = {
  playerHp: 40, playerMaxHp: 40,
  gold: 0,
  deck: ["golpe_basico", "golpe_basico", "escudo", "curacion", "ataque_preciso"],
  floor: 0, totalTurns: 0, diceCount: 3,
};

export default function LoadGame({ theme: t, onStartGame, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const [slots,      setSlots]      = useState<SavedSlot[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmDel, setConfirmDel] = useState<number | null>(null); // slot en proceso de borrado

  async function fetchSlots() {
    setLoading(true);
    const data = await apiGetSaves();
    setSlots(data);
    setLoading(false);
  }

  useEffect(() => { fetchSlots(); }, []);

  async function handleDelete(slot: number) {
    await apiDeleteSave(slot);
    setConfirmDel(null);
    fetchSlots();
  }

  // ── Estilos reutilizados ─────────────────────────────────────────────────────
  const btn = (primary: boolean): React.CSSProperties => ({
    flex: 1, padding: "9px 0",
    fontFamily: t.titleFont, fontSize: 11, letterSpacing: 2,
    cursor: "pointer", borderRadius: 2,
    background:   primary ? t.buttonBg  : "transparent",
    border:       primary ? `1px solid ${t.buttonBorder}` : `1px solid ${t.border}`,
    color:        primary ? t.text      : t.textDim,
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "relative", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 16px", gap: 20,
        animation: "fadeIn 0.35s ease-out",
      }}>
        {/* Cabecera */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: t.titleFont, color: t.textDim, fontSize: 10, letterSpacing: 5 }}>
            DICE TACTICS
          </div>
          <div style={{
            fontFamily: t.titleFont, color: t.primary, fontSize: 22, letterSpacing: 5, marginTop: 4,
            textShadow: `0 0 20px ${t.primary}55`,
          }}>
            PARTIDAS GUARDADAS
          </div>
        </div>

        {/* Grid de 3 slots */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {loading
            ? [1, 2, 3].map(n => <SlotSkeleton key={n} slot={n} t={t} />)
            : slots.map(({ slot, data }) => (
                <SlotCard
                  key={slot}
                  slot={slot}
                  data={data}
                  t={t}
                  confirmingDel={confirmDel === slot}
                  onLoad={() => onStartGame(data!, slot)}
                  onNew={() => onStartGame({ ...STARTING_STATE }, slot)}
                  onDeleteRequest={() => setConfirmDel(slot)}
                  onDeleteConfirm={() => handleDelete(slot)}
                  onDeleteCancel={() => setConfirmDel(null)}
                />
              ))
          }
        </div>

        {/* Volver */}
        <button
          onClick={onBack}
          style={{
            padding: "10px 32px",
            background: "transparent", border: `1px solid ${t.border}`,
            color: t.textDim, fontFamily: t.titleFont,
            fontSize: 11, letterSpacing: 3, cursor: "pointer", borderRadius: 2,
          }}
        >
          ← VOLVER
        </button>
      </div>
    </div>
  );

  // ── Subcomponentes internos ──────────────────────────────────────────────────

  function SlotSkeleton({ slot, t: th }: { slot: number; t: ThemeTokens }) {
    return (
      <div style={{
        width: 240, minHeight: 280,
        background: th.surface2, border: `1px solid ${th.border}`,
        borderRadius: 3, padding: "20px 16px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, opacity: 0.5,
      }}>
        <div style={{ fontFamily: th.titleFont, color: th.textDim, fontSize: 10, letterSpacing: 3 }}>
          SLOT {slot}
        </div>
        <div style={{ color: th.textDim, fontSize: 13 }}>Cargando...</div>
      </div>
    );
  }

  function SlotCard({
    slot, data, t: th,
    confirmingDel, onLoad, onNew, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
  }: {
    slot: number; data: GameState | null; t: ThemeTokens;
    confirmingDel: boolean;
    onLoad: () => void; onNew: () => void;
    onDeleteRequest: () => void; onDeleteConfirm: () => void; onDeleteCancel: () => void;
  }) {
    const hasData = data !== null;
    const hpPct   = hasData ? Math.round((data.playerHp / data.playerMaxHp) * 100) : 0;

    return (
      <div style={{
        width: 240, minHeight: 280,
        background: th.surface2,
        border: `2px solid ${hasData ? th.primary + "88" : th.border}`,
        borderRadius: 3, padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: 12,
        animation: "fadeIn 0.35s ease-out",
      }}>
        {/* Etiqueta de slot */}
        <div style={{
          fontFamily: th.titleFont, fontSize: 10, letterSpacing: 4,
          color: hasData ? th.primary : th.textDim, textAlign: "center",
        }}>
          SLOT {slot}
        </div>

        {hasData ? (
          <>
            {/* Progreso de pisos */}
            <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
              {FLOOR_LABELS.map((label, i) => {
                const done    = i < data.floor;
                const current = i === data.floor;
                const color   = done ? th.primary : current ? th.accent2 : th.border;
                return (
                  <div key={i} title={label} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: done ? th.primary : current ? th.accent2 : th.surface1,
                    border: `1px solid ${color}`,
                    boxShadow: current ? `0 0 6px ${th.accent2}` : "none",
                  }} />
                );
              })}
            </div>

            {/* Nombre del piso actual */}
            <div style={{
              fontFamily: th.titleFont, fontSize: 10, color: th.accent2,
              textAlign: "center", letterSpacing: 2,
            }}>
              {FLOOR_LABELS[Math.min(data.floor, 3)]}
            </div>

            {/* Barra de vida */}
            <div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: th.bodyFont, fontSize: 12, color: th.textDim, marginBottom: 3,
              }}>
                <span>❤ VIDA</span>
                <span style={{ color: th.text }}>{data.playerHp}/{data.playerMaxHp}</span>
              </div>
              <div style={{
                height: 5, background: th.hpBg, borderRadius: 3, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${hpPct}%`,
                  background: hpPct > 50 ? th.hpColor : th.accent,
                  borderRadius: 3,
                }} />
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "6px 12px", fontFamily: th.bodyFont, fontSize: 12,
            }}>
              {[
                ["◈ ORO",    data.gold],
                ["▣ CARTAS", data.deck.length],
                ["⬡ DADOS",  data.diceCount],
                ["↺ TURNOS", data.totalTurns],
              ].map(([label, val]) => (
                <div key={label as string} style={{
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ color: th.textDim }}>{label}</span>
                  <span style={{ color: th.primary, fontFamily: th.titleFont }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Botones CRUD */}
            {!confirmingDel ? (
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button style={btn(true)}  onClick={onLoad}>▶ CARGAR</button>
                <button style={btn(false)} onClick={onDeleteRequest}>🗑</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  style={{ ...btn(false), flex: 1, borderColor: th.accent, color: th.accent }}
                  onClick={onDeleteConfirm}
                >
                  BORRAR
                </button>
                <button style={btn(false)} onClick={onDeleteCancel}>✕</button>
              </div>
            )}
          </>
        ) : (
          /* Slot vacío */
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{ fontSize: 32, opacity: 0.2 }}>📂</div>
            <div style={{ fontFamily: th.bodyFont, color: th.textDim, fontSize: 13 }}>
              SIN DATOS
            </div>
            <button
              style={{ ...btn(true), flex: "unset", padding: "9px 20px" }}
              onClick={onNew}
            >
              + NUEVA PARTIDA
            </button>
          </div>
        )}
      </div>
    );
  }
}
