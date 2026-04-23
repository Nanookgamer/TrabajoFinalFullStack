import type { ThemeTokens, ThemeName } from '../types';

export const THEMES: Record<ThemeName, ThemeTokens> = {
  scifi: {
    bg: '#050510',
    surface1: '#0a0a1a',
    surface2: '#0f0f22',
    border: '#1a1a3a',
    primary: '#00ffcc',
    accent: '#ff00aa',
    accent2: '#0088ff',
    text: '#e0f0ff',
    textDim: '#8090b0',
    hpColor: '#ff3366',
    hpBg: '#200010',
    titleFont: "'Orbitron', sans-serif",
    bodyFont: "'Rajdhani', sans-serif",
    buttonBg: 'linear-gradient(180deg, #0055cc 0%, #003388 100%)',
    buttonBorder: '#0088ff',
    cardBg: '#07071a',
    diceColor: '#00ffcc',
    cardTypeColors: {
      attack: '#ff3366',
      defense: '#00aaff',
      heal: '#00ff88',
      utility: '#aa44ff',
    },
  },
};
