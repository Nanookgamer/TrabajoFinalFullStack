/**
 * Menú principal de Dice Tactics.
 *
 * Se muestra tras iniciar sesión. Ofrece tres opciones:
 *   - Nueva Partida: inicializa un GameState fresco y navega al juego.
 *   - Continuar: carga la partida guardada en el servidor (o localStorage).
 *     El botón permanece deshabilitado hasta que se comprueba si hay guardado.
 *   - Cerrar Sesión: limpia el token y vuelve al login.
 *
 * El fondo usa el efecto Matrix como en las pantallas de autenticación.
 */
import { useRef, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatrixRain } from "../hooks/useMatrixRain";
import { apiGetSave } from "../services/api";
import type { ThemeTokens, GameState } from "../types";

interface Props {
  theme: ThemeTokens;
  onNewGame: () => void;
  onContinue: (saved: GameState) => void;
}

export default function MainMenu({ theme: t, onNewGame, onContinue }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const { user, logout } = useAuth();

  // "loading" mientras se consulta la API; null si no hay partida guardada; GameState si la hay
  const [savedGame, setSavedGame] = useState<GameState | null | "loading">("loading");

  // Comprueba si existe una partida guardada al montar el componente
  useEffect(() => {
    apiGetSave()
      .then(save => setSavedGame(save))
      .catch(() => setSavedGame(null));
  }, []);

  // ── Estilos de botón reutilizados ────────────────────────────────────────────
  const btnBase: React.CSSProperties = {
    width: 260, padding: "13px 0",
    fontFamily: t.titleFont, fontSize: 15, letterSpacing: 3,
    cursor: "pointer", borderRadius: 2, transition: "opacity 0.15s",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: t.buttonBg,
    border: `1px solid ${t.buttonBorder}`,
    color: t.text,
  };

  const btnSecondary: React.CSSProperties = {
    ...btnBase,
    background: "transparent",
    border: `1px solid ${t.border}`,
    color: t.textDim,
  };

  // Botón deshabilitado visualmente (sin partida guardada o aún cargando)
  const btnDisabled: React.CSSProperties = {
    ...btnSecondary,
    opacity: 0.35,
    cursor: "not-allowed",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      {/* Canvas del fondo Matrix */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      {/* Contenido centrado sobre el canvas */}
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100%", gap: 16,
        animation: "fadeIn 0.35s ease-out",
      }}>
        {/* Título con efecto de brillo */}
        <div style={{
          fontFamily: t.titleFont, color: t.primary,
          fontSize: 42, letterSpacing: 8, marginBottom: 8,
          textShadow: `0 0 30px ${t.primary}66`,
        }}>
          DICE TACTICS
        </div>

        {/* Nombre del usuario autenticado */}
        <div style={{
          fontFamily: t.bodyFont, color: t.textDim,
          fontSize: 14, marginBottom: 24, letterSpacing: 2,
        }}>
          {`USUARIO: ${user?.username?.toUpperCase()}`}
        </div>

        {/* Inicia una partida desde el principio */}
        <button style={btnPrimary} onClick={onNewGame}>
          NUEVA PARTIDA
        </button>

        {/* Continuar solo se habilita si hay una partida guardada cargada */}
        <button
          style={savedGame && savedGame !== "loading" ? btnPrimary : btnDisabled}
          disabled={!savedGame || savedGame === "loading"}
          onClick={() => savedGame && savedGame !== "loading" && onContinue(savedGame)}
        >
          CONTINUAR
        </button>

        {/* Cierra la sesión y vuelve al login */}
        <button style={btnSecondary} onClick={logout}>
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}
