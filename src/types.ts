/**
 * Definiciones de tipos TypeScript compartidas por toda la aplicación.
 * Centralizar todos los tipos ahorra el tener que definirlos 
 * cada vez y tenerlo aquí lo puedo llamar donde quiera.
 */

// ── Tipos de carta ────────────────────────────────────────────────────────────

export type CardType = 'attack' | 'defense' | 'heal' | 'utility';

// Requisito que debe cumplir el dado para activar la carta
export type CardRequirement =
  | { type: 'even' }
  | { type: 'odd' }
  | { type: 'exact'; value: number }
  | { type: 'range'; min: number; max: number };

// Efectos que puede tener una carta al resolverse
export interface CardEffect {
  damage?: number;
  hits?: number;                          // Multiplicador de golpes (Hacer daño x cantidad de veces)
  block?: number;                         // Bloqueo del daño entrante
  heal?: number;
  gold?: number;
  reflect?: boolean;                      // Refleja el siguiente ataque del enemigo
  dot?: { dmg: number; turns: number };   // Daño a lo largo del tiempo
  regen?: { hp: number; turns: number };  // Curación por turno
}

export interface Card {
  id: string;
  name: string;
  icon: string;
  type: CardType;
  req: CardRequirement;
  reqLabel: string;  // Texto precomputado del requisito (ej. "PAR", "= 4")
  effect: CardEffect;
  desc: string;
}

// ── Tipos de enemigo ──────────────────────────────────────────────────────────

export interface Enemy {
  id: string;
  name: string;
  image: string;  // Ruta relativa a "/img/"
  maxHp: number;
  attack: number;
  gold: number;   // Oro que otorga al ser derrotado
  desc: string;
  tier: number;
  isBoss?: boolean;
}

// ── Tipos de evento ───────────────────────────────────────────────────────────

export interface EventChoice {
  text: string;
  effect: {
    gold?: number;
    damage?: number;
    heal?: number;
    cost?: number;   // Coste en oro de la opción
    card?: boolean;  // Si es true, la opción otorga una carta aleatoria
  };
  result: string; // Mensaje que se muestra tras elegir
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  desc: string;
  choices: EventChoice[];
}

// ── Estado del juego ──────────────────────────────────────────────────────────

// Datos de la partida (guardada en API y localStorage)
export interface GameState {
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  deck: string[];       // IDs de las cartas del mazo (asi no tengo que guardar toda la carta)
  floor: number;        // Piso actual (0–3)
  totalTurns: number;   // Turnos que ha hecho el jugador en total, es una buena forma de que el jugador vuelva a jugar (para batir su record)
  diceCount: number;    // Número de dados que se lanzan cada turno
  _won?: boolean;       // Resultado final: true = victoria, false = derrota
}

// ── Tipos de tema ─────────────────────────────────────────────────────────────

// Hice un cambio de temas para tener varios colores pero al final no quedaba bien asi que me decante por estos colores más cibernéticos, 
// pero lo mantengo por si en el futuro quiero hacer un tema claro y oscuro
export type ThemeName = 'scifi';

// Todos los tokens de diseño del tema activo — se pasan como prop a cada componente
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

// ── Tipos de usuario ──────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
}

// ── Tipos de navegación ───────────────────────────────────────────────────────

// Pantallas del flujo de la aplicación principal (fuera del juego)
export type AppScreen = 'login' | 'register' | 'menu' | 'loadgame' | 'game';

// Pantallas dentro de una partida activa
export type GameScreen = 'transition' | 'combat' | 'shop' | 'event' | 'result';

// Fase del turno de combate
export type Phase = 'roll' | 'assign' | 'resolving';
