import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatrixRain } from "../background/useMatrixRain";
import type { ThemeTokens } from "../types";

interface Props {
  theme: ThemeTokens;
  onPlay: () => void;
}

export default function MainMenu({ theme: t, onPlay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);
  const { user, logout } = useAuth();

  const btnPrimary: React.CSSProperties = {
    width: 260, padding: "13px 0",
    fontFamily: t.titleFont, fontSize: 15, letterSpacing: 3,
    cursor: "pointer", borderRadius: 2,
    background: t.buttonBg, border: `1px solid ${t.buttonBorder}`, color: t.text,
  };

  const btnSecondary: React.CSSProperties = {
    width: 260, padding: "13px 0",
    fontFamily: t.titleFont, fontSize: 15, letterSpacing: 3,
    cursor: "pointer", borderRadius: 2,
    background: "transparent", border: `1px solid ${t.border}`, color: t.textDim,
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100%", gap: 16,
        animation: "fadeIn 0.35s ease-out",
      }}>
        <div style={{
          fontFamily: t.titleFont, color: t.primary,
          fontSize: 42, letterSpacing: 8, marginBottom: 8,
          textShadow: `0 0 30px ${t.primary}66`,
        }}>
          DICE TACTICS
        </div>

        <div style={{
          fontFamily: t.bodyFont, color: t.textDim,
          fontSize: 14, marginBottom: 24, letterSpacing: 2,
        }}>
          {`OPERADOR: ${user?.username?.toUpperCase()}`}
        </div>

        <button style={btnPrimary} onClick={onPlay}>
          JUGAR
        </button>

        <button style={btnSecondary} onClick={logout}>
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}
