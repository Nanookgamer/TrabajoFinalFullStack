import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMatrixRain } from '../hooks/useMatrixRain';
import type { ThemeTokens } from '../types';

interface Props {
  theme: ThemeTokens;
  onSuccess: () => void;
  onRegister: () => void;
}

export default function Login({ theme: t, onSuccess, onRegister }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef);

  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 3) {
      setError('Usuario requerido y contraseña mínimo 3 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: t.surface1,
    border: `1px solid ${t.border}`,
    borderRadius: 2,
    color: t.text,
    fontFamily: t.bodyFont,
    fontSize: 15,
    outline: 'none',
  };

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px',
    background: t.buttonBg,
    border: `1px solid ${t.buttonBorder}`,
    borderRadius: 2,
    color: t.text,
    fontFamily: t.titleFont,
    fontSize: 14,
    letterSpacing: 2,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    animation: loading ? 'pulse 1s infinite' : 'none',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: t.bg }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <div style={{
          background: t.surface2,
          border: `2px solid ${t.border}`,
          borderRadius: 4,
          padding: '40px 36px',
          width: 340,
          animation: 'fadeIn 0.35s ease-out',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <rect x="2" y="2" width="20" height="20" rx="2" fill={t.primary} opacity="0.9" />
              <rect x="26" y="2" width="20" height="20" rx="2" fill={t.accent} opacity="0.9" />
              <rect x="2" y="26" width="20" height="20" rx="2" fill={t.accent} opacity="0.9" />
              <rect x="26" y="26" width="20" height="20" rx="2" fill={t.primary} opacity="0.9" />
              <circle cx="12" cy="12" r="3" fill={t.bg} />
              <circle cx="36" cy="12" r="3" fill={t.bg} />
              <circle cx="12" cy="36" r="3" fill={t.bg} />
              <circle cx="36" cy="36" r="3" fill={t.bg} />
            </svg>
            <div style={{
              fontFamily: t.titleFont,
              color: t.primary,
              fontSize: 22,
              marginTop: 8,
              letterSpacing: 4,
            }}>
              DICE TACTICS
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

            {error && (
              <div style={{ color: t.accent, fontFamily: t.bodyFont, fontSize: 13, textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'AUTENTICANDO...' : 'ACCEDER'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={onRegister}
              style={{
                background: 'none',
                border: 'none',
                color: t.textDim,
                fontFamily: t.bodyFont,
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'underline',
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
