/**
 * Pantalla de transición entre fases del juego.
 * Se muestra ~2.4 segundos entre combate → tienda → evento.
 * Incluye un mensaje con animación de pulso y una barra de progreso
 * que se llena con el keyframe "progressFill" de styles.css.
 */
import type { ThemeTokens } from "../types";

interface Props {
  message: string;
  theme: ThemeTokens;
}

export default function TransitionScreen({ message, theme: t }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 24,
    }}>
      {/* Mensaje animado con pulso */}
      <div style={{
        fontFamily: t.titleFont, color: t.primary, fontSize: 22,
        letterSpacing: 4, animation: "pulse 1s infinite",
      }}>
        {message}
      </div>

      {/* Barra de progreso (dura 2.2 s para terminar antes del cambio de pantalla) */}
      <div style={{ width: 260, height: 4, background: t.surface2, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", background: t.primary, borderRadius: 2,
          animation: "progressFill 2.2s ease-out forwards",
        }} />
      </div>
    </div>
  );
}
