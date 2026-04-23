import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { THEMES } from './data/themes';
import { STARTER_DECK } from './data/cards';
import type { AppScreen, GameState } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import MainMenu from './pages/MainMenu';
import Game from './pages/Game';
import './styles.css';

const t = THEMES['scifi'];
const STARTING_HP = 40;
const STARTING_DICE = 3;

function AppContent() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<AppScreen>('login');
  const [gameState, setGameState] = useState<GameState | null>(null);

  if (!user) {
    if (screen === 'register') {
      return (
        <Register
          theme={t}
          onSuccess={() => setScreen('menu')}
          onBack={() => setScreen('login')}
        />
      );
    }
    return (
      <Login
        theme={t}
        onSuccess={() => setScreen('menu')}
        onRegister={() => setScreen('register')}
      />
    );
  }

  if (screen === 'menu') {
    return (
      <MainMenu
        theme={t}
        onNewGame={() => {
          setGameState({
            playerHp: STARTING_HP,
            playerMaxHp: STARTING_HP,
            gold: 0,
            deck: [...STARTER_DECK],
            floor: 0,
            totalTurns: 0,
            diceCount: STARTING_DICE,
          });
          setScreen('game');
        }}
        onContinue={(saved) => {
          setGameState(saved);
          setScreen('game');
        }}
      />
    );
  }

  if (screen === 'game' && gameState) {
    return (
      <Game
        theme={t}
        gameState={gameState}
        onGameStateChange={setGameState}
        onReturnToMenu={() => {
          setGameState(null);
          setScreen('menu');
        }}
      />
    );
  }

  return null;
}

export default function Juego() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
