import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatrixRain } from "../hooks/useMatrixRain";
import type { ThemeTokens } from "../types";

interface Props {
  theme: ThemeTokens;
  onSuccess: () => void;
  onBack: () => void;
}

export default function Register({ theme: t, onSuccess, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return;
    }
    if (password.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

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
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          <div style={{
            fontFamily: t.titleFont,
            color: t.primary,
            fontSize: 18,
            letterSpacing: 3,
            textAlign: "center",
            marginBottom: 24,
          }}>
            REGISTRO
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              style={inputStyle}
              placeholder="USUARIO (MÍN. 3)"
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
              autoComplete="new-password"
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="CONFIRMAR CONTRASEÑA"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <div style={{ color: t.accent, fontFamily: t.bodyFont, fontSize: 13, textAlign: "center" }}>
                {error}
              </div>
            )}

            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? "PROCESANDO..." : "CREAR CUENTA"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: t.textDim,
                fontFamily: t.bodyFont,
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← VOLVER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
