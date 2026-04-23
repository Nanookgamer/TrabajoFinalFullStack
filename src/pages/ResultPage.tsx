import type { ThemeTokens, GameState } from '../types';

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onReturnToMenu: () => void;
  onNewGame: () => void;
}

export default function ResultPage({ theme: t, gameState, onReturnToMenu, onNewGame }: Props) {
  const won = gameState._won === true;

  const btnPrimary: React.CSSProperties = {
    padding: '12px 32px',
    background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
    borderRadius: 2,
    color: t.text, fontFamily: t.titleFont, fontSize: 14,
    letterSpacing: 3, cursor: 'pointer',
  };

  const btnSecondary: React.CSSProperties = {
    padding: '12px 32px',
    background: 'transparent', border: `1px solid ${t.border}`,
    borderRadius: 2,
    color: t.textDim, fontFamily: t.titleFont, fontSize: 14,
    letterSpacing: 3, cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: t.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: t.bodyFont, color: t.text,
      animation: 'fadeIn 0.35s ease-out',
    }}>
      <div style={{
        background: t.surface2, border: `2px solid ${won ? t.primary : t.accent}`,
        borderRadius: 4,
        padding: '48px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        maxWidth: 480,
      }}>
        <div style={{
          fontSize: 88,
          filter: `drop-shadow(0 0 20px ${won ? t.primary : t.accent})`,
        }}>
          {won ? '🏆' : '💀'}
        </div>

        <div style={{
          fontFamily: t.titleFont,
          color: won ? t.primary : t.accent,
          fontSize: 48,
          letterSpacing: 6,
        }}>
          {won ? '¡VICTORIA!' : 'DERROTA'}
        </div>

        <div style={{ fontStyle: 'italic', color: t.textDim, textAlign: 'center', fontSize: 14, lineHeight: 1.6 }}>
          {won
            ? 'PROTOCOLO COMPLETADO. AMENAZA NEUTRALIZADA. MISIÓN EXITOSA.'
            : 'SISTEMA CAÍDO. REINICIANDO PROTOCOLOS DE DEFENSA.'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', marginTop: 8 }}>
          {[
            { label: 'HP FINAL', value: `${Math.max(0, gameState.playerHp)}/${gameState.playerMaxHp}` },
            { label: 'GOLD TOTAL', value: `🪙 ${gameState.gold}` },
            { label: 'TURNOS', value: String(gameState.totalTurns) },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: t.surface1, border: `1px solid ${t.border}`,
              borderRadius: 2, padding: '12px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: t.textDim, marginBottom: 6, letterSpacing: 1 }}>{label}</div>
              <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 15 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button style={btnPrimary} onClick={onNewGame}>REINICIAR</button>
          <button style={btnSecondary} onClick={onReturnToMenu}>MENÚ</button>
        </div>
      </div>
    </div>
  );
}
