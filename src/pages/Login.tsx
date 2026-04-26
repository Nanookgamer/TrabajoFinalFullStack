/**
 * Pantalla de inicio de sesión.
 *
 * Muestra el logo del juego, un formulario con usuario y contraseña
 * y un enlace para ir a la pantalla de registro.
 * El fondo usa el efecto de lluvia de Matrix (useMatrixRain).
 */
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatrixRain } from "../background/useMatrixRain";
import type { ThemeTokens } from "../types";

interface Props {
  theme: ThemeTokens;
  onSuccess: () => void;   // Llamado tras iniciar sesión correctamente
  onRegister: () => void;  // Navega a la pantalla de registro
}

export default function Login({ theme: t, onSuccess, onRegister }: Props) {
  // Canvas sobre el que se dibuja el efecto Matrix
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const { login } = useAuth();

  // ── Estado del formulario ────────────────────────────────────────────────────
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // Valida los campos y llama a la API de autenticación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 3) {
      setError("Usuario requerido y contraseña mínimo 3 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // ── Estilos reutilizados ─────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: t.surface1,
    border: `1px solid ${t.border}`,
    borderRadius: 2,
    color: t.text,
    fontFamily: t.bodyFont,
    fontSize: 15,
    outline: "none",
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px",
    background: t.buttonBg,
    border: `1px solid ${t.buttonBorder}`,
    borderRadius: 2,
    color: t.text,
    fontFamily: t.titleFont,
    fontSize: 14,
    letterSpacing: 2,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    animation: loading ? "pulse 1s infinite" : "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      {/* Canvas del fondo Matrix */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      {/* Tarjeta del formulario centrada sobre el canvas */}
      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%",
      }}>
        <div style={{
          background: t.surface2,
          border: `2px solid ${t.border}`,
          borderRadius: 4,
          padding: "40px 36px",
          width: 340,
          animation: "fadeIn 0.35s ease-out",
        }}>
          {/* Logo y título del juego */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img width="80" height="80" src="/img/logo_DiceTactics.png"style={{
              marginBottom: 28,
            }}></img>
            <div style={{
              fontFamily: t.titleFont, color: t.primary,
              fontSize: 22, marginTop: 8, letterSpacing: 4,
            }}>
              DICE TACTICS
            </div>
          </div>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              style={inputStyle}
              placeholder="USUARIO"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="CONTRASEÑA"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {/* Mensaje de error de validación o de red */}
            {error && (
              <div style={{ color: t.accent, fontFamily: t.bodyFont, fontSize: 13, textAlign: "center" }}>
                {error}
              </div>
            )}

            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? "AUTENTICANDO..." : "ACCEDER"}
            </button>
          </form>

          {/* Enlace para ir a la pantalla de registro */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={onRegister}
              style={{
                background: "none", border: "none",
                color: t.textDim, fontFamily: t.bodyFont,
                fontSize: 13, cursor: "pointer", textDecoration: "underline",
              }}
            >
              REGISTRARSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
