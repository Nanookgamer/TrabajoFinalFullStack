/**
 * Pantalla de resultado final de la partida.
 *
 * Se muestra al terminar el juego, tanto si el jugador ganó como si perdió.
 * Lee el campo `_won` del GameState para determinar el resultado:
 *   - true  → Victoria: borde cian, trofeo 🏆, mensaje positivo.
 *   - false → Derrota: borde magenta, calavera 💀, mensaje de derrota.
 *
 * Muestra las estadísticas finales: HP, oro acumulado y turnos jugados.
 * Permite reiniciar la partida o volver al menú principal.
 */
import type { ThemeTokens, GameState } from "../types";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onReturnToMenu: () => void;
  onNewGame: () => void;
}

export default function ResultPage({ theme: t, gameState, onReturnToMenu, onNewGame }: Props) {
  const won = gameState._won === true;

  // ── Estilos de botón ─────────────────────────────────────────────────────────
  const btnPrimary: React.CSSProperties = {
    padding: "12px 32px",
    background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
    borderRadius: 2,
    color: t.text, fontFamily: t.titleFont, fontSize: 14,
    letterSpacing: 3, cursor: "pointer",
  };

  const btnSecondary: React.CSSProperties = {
    padding: "12px 32px",
    background: "transparent", border: `1px solid ${t.border}`,
    borderRadius: 2,
    color: t.textDim, fontFamily: t.titleFont, fontSize: 14,
    letterSpacing: 3, cursor: "pointer",
  };

  // Estadísticas finales que se muestran en la cuadrícula
  const stats = [
    { label: "HP FINAL",   value: `${Math.max(0, gameState.playerHp)}/${gameState.playerMaxHp}` },
    { label: "GOLD TOTAL", value: `🪙 ${gameState.gold}` },
    { label: "TURNOS",     value: String(gameState.totalTurns) },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: t.bodyFont, color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      {/* Tarjeta de resultado — el borde cambia según victoria o derrota */}
      <div style={{
        background: t.surface2,
        border: `2px solid ${won ? t.primary : t.accent}`,
        borderRadius: 4, padding: "48px 48px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        maxWidth: 480,
      }}>
        {/* Icono principal con brillo */}
        <div style={{
          fontSize: 88,
          filter: `drop-shadow(0 0 20px ${won ? t.primary : t.accent})`,
        }}>
          {won ? "🏆" : "💀"}
        </div>

        {/* Título de victoria o derrota */}
        <div style={{
          fontFamily: t.titleFont,
          color: won ? t.primary : t.accent,
          fontSize: 48, letterSpacing: 6,
        }}>
          {won ? "¡VICTORIA!" : "DERROTA"}
        </div>

        {/* Mensaje temático según el resultado */}
        <div style={{ fontStyle: "italic", color: t.textDim, textAlign: "center", fontSize: 14, lineHeight: 1.6 }}>
          {won
            ? "PROTOCOLO COMPLETADO. AMENAZA NEUTRALIZADA. MISIÓN EXITOSA."
            : "SISTEMA CAÍDO. REINICIANDO PROTOCOLOS DE DEFENSA."}
        </div>

        {/* Cuadrícula de estadísticas finales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, width: "100%", marginTop: 8 }}>
          {stats.map(({ label, value }) => (
            <div key={label} style={{
              background: t.surface1, border: `1px solid ${t.border}`,
              borderRadius: 2, padding: "12px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: t.textDim, marginBottom: 6, letterSpacing: 1 }}>{label}</div>
              <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 15 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <button style={btnPrimary}   onClick={onNewGame}>REINICIAR</button>
          <button style={btnSecondary} onClick={onReturnToMenu}>MENÚ</button>
        </div>
      </div>
    </div>
  );
}
