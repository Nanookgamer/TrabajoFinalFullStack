export type CardType = 'attack' | 'defense' | 'heal' | 'utility';

export type CardRequirement =
  | { type: 'even' }
  | { type: 'odd' }
  | { type: 'exact'; value: number }
  | { type: 'range'; min: number; max: number };

export interface CardEffect {
  damage?: number;
  hits?: number;
  block?: number;
  heal?: number;
  gold?: number;
  reflect?: boolean;
  dot?: { dmg: number; turns: number };
  regen?: { hp: number; turns: number };
}

export interface Card {
  id: string;
  name: string;
  icon: string;
  type: CardType;
  req: CardRequirement;
  reqLabel: string;
  effect: CardEffect;
  desc: string;
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  attack: number;
  gold: number;
  desc: string;
  tier: number;
  isBoss?: boolean;
}

export interface EventChoice {
  text: string;
  effect: {
    gold?: number;
    damage?: number;
    heal?: number;
    cost?: number;
    card?: boolean;
  };
  result: string;
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  desc: string;
  choices: EventChoice[];
}

export interface GameState {
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  deck: string[];
  floor: number;
  totalTurns: number;
  diceCount: number;
  _won?: boolean;
}

export type ThemeName = 'scifi';

export interface ThemeTokens {
  bg: string;
  surface1: string;
  surface2: string;
  border: string;
  primary: string;
  accent: string;
  accent2: string;
  text: string;
  textDim: string;
  hpColor: string;
  hpBg: string;
  titleFont: string;
  bodyFont: string;
  buttonBg: string;
  buttonBorder: string;
  cardBg: string;
  diceColor: string;
  cardTypeColors: Record<CardType, string>;
}

export interface User {
  id: number;
  username: string;
}

export type GameScreen = 'transition' | 'combat' | 'shop' | 'event' | 'result';
export type AppScreen = 'login' | 'register' | 'menu' | 'game';
