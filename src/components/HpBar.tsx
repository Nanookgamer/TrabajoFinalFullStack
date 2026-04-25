/**
 * Barra de puntos de vida reutilizable para jugador y enemigo.
 * Cambia de color según el porcentaje restante:
 *   - Verde  (> 60 %): vida alta
 *   - Amarillo (> 30 %): vida media
 *   - Rojo / accent (≤ 30 %): vida crítica
 */
import type { ThemeTokens } from "../types";

interface Props {
  current: number;
  max: number;
  theme: ThemeTokens;
}

// Devuelve el color de la barra según el porcentaje de vida restante
function hpBarColor(pct: number, accent: string): string {
  if (pct > 0.6) return "#44cc66";
  if (pct > 0.3) return "#ffcc00";
  return accent;
}

export default function HpBar({ current, max, theme: t }: Props) {
  const pct = current / max;

  return (
    <div style={{ width: "100%" }}>
      {/* Números de HP: actual / máximo */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: t.textDim }}>HP</span>
        <span>{current}/{max}</span>
      </div>

      {/* Barra visual con transición suave al cambiar el ancho */}
      <div style={{ background: t.hpBg, borderRadius: 4, height: 8, width: "100%" }}>
        <div style={{
          width: `${pct * 100}%`,
          height: "100%",
          background: hpBarColor(pct, t.hpColor),
          borderRadius: 4,
          transition: "width 0.3s",
        }} />
      </div>
    </div>
  );
}
