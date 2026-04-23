# Handoff: Dice Dungeon — Videojuego de Dados

## Overview
Dice Dungeon es un videojuego de rol basado en dados y cartas, inspirado en Dice Dungeons. El jugador avanza por 4 pisos enfrentándose a enemigos, comprando cartas en una tienda y eligiendo en eventos aleatorios. El combate consiste en lanzar dados y asignarlos a cartas con requisitos numéricos (par, impar, exacto, rango).

## About the Design Files
Los archivos `.jsx` y `.js` en esta carpeta son **prototipos de diseño creados en HTML + React/Babel**. NO son código de producción. La tarea es **replicar estos diseños en un proyecto React + TypeScript real**, usando las mismas estructuras de componentes, lógica de juego y estilos documentados aquí.

## Fidelity
**Alta fidelidad (hifi)**: Los prototipos muestran los colores, tipografía, espaciado e interacciones finales. El desarrollador debe replicar la UI con la máxima fidelidad posible usando el sistema de diseño documentado en la sección "Design Tokens".

---

## Arquitectura del Proyecto

```
src/
├── types/
│   └── game.ts              # Interfaces TypeScript (ver sección Types)
├── data/
│   └── gameData.ts          # Cartas, enemigos, eventos, mazos
├── context/
│   └── GameContext.tsx      # Estado global del juego
├── components/
│   ├── sprites/
│   │   ├── EnemySprite.tsx  # Sprites SVG de enemigos
│   │   └── PlayerSprite.tsx # Sprite SVG del jugador
│   ├── combat/
│   │   ├── Die.tsx          # Componente dado
│   │   ├── Card.tsx         # Componente carta
│   │   └── HpBar.tsx        # Barra de HP
│   └── vendor/
│       └── VendorNPC.tsx    # NPC vendedor tienda
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── MenuScreen.tsx
│   ├── CombatScreen.tsx
│   ├── ShopScreen.tsx
│   ├── EventScreen.tsx
│   ├── TransitionScreen.tsx
│   └── WinLoseScreen.tsx
├── hooks/
│   └── useMatrixRain.ts     # Hook para animación canvas
├── theme/
│   └── themes.ts            # Tokens de diseño (2 temas)
└── App.tsx                  # Router principal
```

---

## TypeScript Types

```typescript
// src/types/game.ts

export type Theme = 'fantasy' | 'scifi';

export type CardType = 'attack' | 'defense' | 'heal' | 'utility';

export interface CardRequirement {
  type: 'even' | 'odd' | 'exact' | 'range';
  value?: number;   // para 'exact'
  min?: number;     // para 'range'
  max?: number;     // para 'range'
}

export interface CardEffect {
  damage?: number;
  hits?: number;               // multiplicador de golpes
  block?: number;              // 9999 = bloqueo total
  heal?: number;
  gold?: number;
  reflect?: boolean;
  dot?: { dmg: number; turns: number };      // daño por turno
  regen?: { hp: number; turns: number };     // cura por turno
}

export interface Card {
  id: string;
  name: string;
  icon: string;
  type: CardType;
  req: CardRequirement;
  reqLabel: string;            // texto mostrado: 'PAR', '= 4', '3 – 6', etc.
  effect: CardEffect;
  desc: string;
}

export interface Enemy {
  id: 'slime' | 'golem' | 'brujo' | 'dragon';
  name: string;
  maxHp: number;
  attack: number;
  gold: number;
  desc: string;
  tier: number;
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  desc: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  effect: EventEffect;
  result: string;
}

export interface EventEffect {
  gold?: number;
  damage?: number;
  heal?: number;
  cost?: number;
  card?: boolean;
}

export interface GameState {
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  deck: string[];              // array de card IDs
  floor: number;               // 0–3
  totalTurns: number;
  diceCount: number;           // 3–8
  _won?: boolean;              // solo en pantalla win/lose
}

export interface DieState {
  value: number;               // 1–6
  used: boolean;
  selected?: boolean;
}

export interface HandCard extends Card {
  activated: boolean;
  assignedDie: number | null;
}

export interface StatusEffects {
  playerBlock: number;
  playerReflect: boolean;
  playerRegen: number;         // turnos restantes
  enemyPoison: number;         // turnos restantes
}
```

---

## Design Tokens

```typescript
// src/theme/themes.ts

export const THEMES = {
  fantasy: {
    // Fondos
    bg:        '#1a1008',
    surface:   '#120c04',
    surface2:  '#1f1505',
    border:    '#4a3010',

    // Colores principales
    gold:      '#d4a017',
    accent:    '#c44b1a',
    accent2:   '#8B6914',

    // Texto
    text:      '#f0e6c8',
    textDim:   '#9a8060',

    // HP
    hp:        '#c44b1a',
    hpBg:      '#3a1a0a',

    // Tipografía
    fontTitle: "'Cinzel', serif",           // Google Fonts
    fontBody:  "'Crimson Text', serif",     // Google Fonts

    // Cartas
    cardBg:     '#0d0904',
    cardBorder: '#5a3a10',

    // Dados
    diceColor: '#d4a017',
    diceBg:    '#1f1505',

    // Botones
    buttonBg:     'linear-gradient(180deg, #c44b1a 0%, #8B3010 100%)',
    buttonBorder: '#e05520',
    btnText:      '#fff0d0',

    // Colores por tipo de carta
    reqBg: {
      attack:  '#2a0800',
      defense: '#001030',
      heal:    '#003018',
      utility: '#1a0a30',
    },
    reqColor: {
      attack:  '#ff6633',
      defense: '#4499ff',
      heal:    '#33dd77',
      utility: '#cc88ff',
    },
  },

  scifi: {
    bg:        '#050510',
    surface:   '#0a0a1a',
    surface2:  '#0f0f22',
    border:    '#1a1a3a',
    gold:      '#00ffcc',
    accent:    '#ff00aa',
    accent2:   '#0088ff',
    text:      '#e0f0ff',
    textDim:   '#8090b0',
    hp:        '#ff3366',
    hpBg:      '#200010',
    fontTitle: "'Orbitron', sans-serif",
    fontBody:  "'Rajdhani', sans-serif",
    cardBg:    '#07071a',
    cardBorder:'#2a2a5a',
    diceColor: '#00ffcc',
    diceBg:    '#0a0a1a',
    buttonBg:     'linear-gradient(180deg, #0055cc 0%, #003388 100%)',
    buttonBorder: '#0088ff',
    btnText:      '#e0f0ff',
    reqBg: {
      attack:  '#200010',
      defense: '#001020',
      heal:    '#002020',
      utility: '#100020',
    },
    reqColor: {
      attack:  '#ff3366',
      defense: '#00aaff',
      heal:    '#00ff88',
      utility: '#aa44ff',
    },
  },
} as const;

export type ThemeConfig = typeof THEMES.fantasy;
```

---

## Lógica de Requisitos de Dados

```typescript
// src/utils/checkReq.ts

export function checkReq(dieValue: number, req: CardRequirement): boolean {
  switch (req.type) {
    case 'even':  return dieValue % 2 === 0;
    case 'odd':   return dieValue % 2 !== 0;
    case 'exact': return dieValue === req.value;
    case 'range': return dieValue >= req.min! && dieValue <= req.max!;
    default:      return false;
  }
}
```

---

## Datos del Juego

```typescript
// src/data/gameData.ts

export const CARDS: Card[] = [
  { id: 'golpe_basico',   name: 'Impacto Binario',    icon: '⚡', type: 'attack',
    req: { type: 'even' },              reqLabel: 'PAR',
    effect: { damage: 4 },             desc: 'Descarga binaria que inflige 4 de daño' },
  { id: 'ataque_preciso', name: 'Precisión Letal',    icon: '🎯', type: 'attack',
    req: { type: 'exact', value: 4 },  reqLabel: '= 4',
    effect: { damage: 7 },             desc: 'Golpe calculado al milímetro. 7 de daño' },
  { id: 'furia',          name: 'Sobrecarga Crítica', icon: '💥', type: 'attack',
    req: { type: 'exact', value: 6 },  reqLabel: '= 6',
    effect: { damage: 12 },            desc: 'Sistema al límite. 12 de daño masivo' },
  { id: 'doble_golpe',    name: 'Combo Digital',      icon: '⚔️', type: 'attack',
    req: { type: 'range', min: 3, max: 6 }, reqLabel: '3 – 6',
    effect: { damage: 4, hits: 2 },    desc: 'Dos impactos rápidos de 4 cada uno' },
  { id: 'electro',        name: 'Rayo de Datos',      icon: '🌩️', type: 'attack',
    req: { type: 'even' },             reqLabel: 'PAR',
    effect: { damage: 7 },             desc: 'Pulso eléctrico que fríe circuitos. 7 daño' },
  { id: 'explosion',      name: 'Bomba de Código',    icon: '💣', type: 'attack',
    req: { type: 'range', min: 5, max: 6 }, reqLabel: '5 – 6',
    effect: { damage: 14 },            desc: 'Payload explosivo. 14 de daño total' },
  { id: 'veneno',         name: 'Virus Corrupto',     icon: '🧪', type: 'attack',
    req: { type: 'range', min: 4, max: 5 }, reqLabel: '4 – 5',
    effect: { damage: 2, dot: { dmg: 2, turns: 3 } }, desc: '2 daño + corrupción (2/turno × 3)' },
  { id: 'escudo',         name: 'Firewall Básico',    icon: '🛡️', type: 'defense',
    req: { type: 'odd' },              reqLabel: 'IMPAR',
    effect: { block: 6 },              desc: 'Activa el firewall. Bloquea 6 de daño' },
  { id: 'barrera',        name: 'Muro de Datos',      icon: '🏰', type: 'defense',
    req: { type: 'exact', value: 1 },  reqLabel: '= 1',
    effect: { block: 16 },             desc: 'Barrera maciza. Absorbe 16 de daño' },
  { id: 'escudo_magico',  name: 'Barrera Cuántica',  icon: '✨', type: 'defense',
    req: { type: 'exact', value: 3 },  reqLabel: '= 3',
    effect: { block: 9999 },           desc: 'Campo cuántico. Bloquea TODO el daño' },
  { id: 'contraataque',   name: 'Protocolo Reflejo', icon: '🔄', type: 'defense',
    req: { type: 'exact', value: 5 },  reqLabel: '= 5',
    effect: { reflect: true },         desc: 'Devuelve el próximo ataque al remitente' },
  { id: 'curacion',       name: 'Corrección de Código', icon: '💚', type: 'heal',
    req: { type: 'range', min: 1, max: 3 }, reqLabel: '1 – 3',
    effect: { heal: 6 },               desc: 'Parchea los errores críticos. +6 HP' },
  { id: 'gran_curacion',  name: 'Reparación Total',  icon: '💊', type: 'heal',
    req: { type: 'exact', value: 2 },  reqLabel: '= 2',
    effect: { heal: 14 },              desc: 'Restauración completa del sistema. +14 HP' },
  { id: 'regeneracion',   name: 'Auto-Reparación',   icon: '🌿', type: 'heal',
    req: { type: 'exact', value: 1 },  reqLabel: '= 1',
    effect: { regen: { hp: 4, turns: 3 } }, desc: 'Nanobots activos. +4 HP/turno × 3' },
  { id: 'pickpocket',     name: 'Hackeo Financiero', icon: '💰', type: 'utility',
    req: { type: 'odd' },              reqLabel: 'IMPAR',
    effect: { gold: 6 },               desc: 'Drena 6 créditos del enemigo' },
];

export const ENEMIES: Enemy[] = [
  { id: 'slime',  name: 'Slime Mecánico',    maxHp: 24,  attack: 4,  gold: 7,  tier: 1,
    desc: 'Una masa de metal líquido y código corrupto' },
  { id: 'golem',  name: 'Golem de Datos',    maxHp: 42,  attack: 7,  gold: 12, tier: 2,
    desc: 'Construido con fragmentos de código antiguo y acero fundido' },
  { id: 'brujo',  name: 'Brujo Cibernético', maxHp: 58,  attack: 10, gold: 18, tier: 3,
    desc: 'Magia arcana y circuitos cuánticos fusionados en un ser eterno' },
  { id: 'dragon', name: 'Dragón de Circuitos', maxHp: 92, attack: 14, gold: 30, tier: 4,
    desc: 'El señor supremo de la mazmorra digital. Su aliento destruye mundos' },
];

export const STARTER_DECK: string[] =
  ['golpe_basico', 'escudo', 'curacion', 'ataque_preciso', 'doble_golpe'];

export const SHOP_POOL: string[] = [
  'furia', 'gran_curacion', 'veneno', 'explosion',
  'contraataque', 'electro', 'escudo_magico', 'regeneracion',
  'doble_golpe', 'barrera', 'pickpocket',
];
```

---

## Flujo de Juego

```
Login / Registro
      ↓
    Menú
      ↓
  Combat Floor 0  (Slime Mecánico — 24 HP)
      ↓ victoria
    Tienda
      ↓
  Combat Floor 1  (Golem de Datos — 42 HP)
      ↓ victoria
    Evento
      ↓
  Combat Floor 2  (Brujo Cibernético — 58 HP)
      ↓ victoria
    Tienda
      ↓
  Combat Floor 3  (Dragón de Circuitos — 92 HP)
      ↓ victoria / derrota
  Pantalla Win / Lose
```

**Lógica de alternancia post-combate:**
```typescript
const nextFloor = gameState.floor + 1;
if (nextFloor >= 4) → WIN
else if (nextFloor % 2 === 1) → 'shop'   // floors 1, 3
else → 'event'                           // floor 2
```

---

## Mecánica de Combate (Turno a Turno)

### Fases por turno
1. **`'roll'`** — Mostrar botón "Lanzar Dados". El jugador pulsa para lanzar.
2. **`'assign'`** — Dados muestran valores. Jugador selecciona un dado (highlight) y luego pulsa una carta compatible → carta se activa. Puede desactivar pulsando de nuevo.
3. **`'resolving'`** — Async: ejecutar cartas activadas con delays visuales, luego ataque enemigo, luego comprobar victoria/derrota.

### Compatibilidad dado–carta
```typescript
// Un dado satisface una carta si:
checkReq(die.value, card.req) === true
// Y el dado no está ya usado (die.used === false)
```

### Ejecución de efectos (en orden, con delay de ~400ms entre cada uno)
```typescript
// Para cada carta activada:
if (effect.damage)  enemyHp -= damage * (hits ?? 1)
if (effect.block)   playerBlock += block   // 9999 = infinito
if (effect.heal)    playerHp = min(playerMaxHp, playerHp + heal)
if (effect.gold)    gold += gold
if (effect.reflect) playerReflect = true
if (effect.regen)   playerRegen = regen.turns
if (effect.dot)     enemyPoison += dot.turns

// Tras cartas: veneno enemigo (-2 HP/turno)
// Luego: regeneración jugador (+4 HP si playerRegen > 0)
// Luego: ataque enemigo → max(0, enemy.attack - playerBlock)
// Si playerReflect: el daño se devuelve al enemigo en su lugar
// Reset: playerBlock = 0 al final del turno
```

---

## Screens

### LoginScreen
- Fondo: animación canvas Matrix (caracteres cayendo)
  - Fantasy: runas y símbolos dorados
  - Sci-Fi: katakana y código en cian
- Formulario centrado con campos: usuario + contraseña
- Validación: usuario mín. 1 char, contraseña mín. 3 chars
- Link a RegisterScreen: "¿No tienes cuenta? Créate una aquí"
- Al login exitoso → MenuScreen

### RegisterScreen
- Mismo fondo Matrix que Login
- Campos: usuario, contraseña, confirmar contraseña
- Validación: usuario ≥ 3 chars, contraseñas coinciden
- Al registro exitoso → MenuScreen (login automático)

### MenuScreen
- Fondo animado canvas:
  - Fantasy: partículas (símbolos, dados) flotando hacia arriba con rotación
  - Sci-Fi: lluvia de datos + línea de escaneo horizontal
- Botones: Nueva Partida, Continuar (disabled si no hay save), Cerrar Sesión, Salir
- Persistencia: `localStorage` para usuario y estado de juego

### TransitionScreen
- Fondo oscuro, texto centrado con animación pulse
- Barra de progreso animada de 0 → 100% en ~2.2s
- Al llegar a 100% → navegar a siguiente pantalla

### CombatScreen
Layout (flex column, 100vh):
```
[Header: floor progress + gold]
[Battle Area: flex row]
  ├── [Player Panel: sprite + HP + status] ← izquierda
  ├── [Battle Log: scroll] ← centro (210px)
  └── [Enemy Panel: sprite + HP + atk] ← derecha (row-reverse)
[Dice Section: dice row + controls]
[Cards Row: horizontal scroll, all deck cards]
```

**Interacción cartas:**
- Dado seleccionado → cartas compatibles se iluminan (`canActivate = true`)
- Cartas incompatibles se oscurecen (`dimmed = true`)
- Al activar carta: sube 10px, escala 1.04x, checkmark
- Al confirmar turno: resolver efectos con animaciones

### ShopScreen
Layout (flex column):
```
[Header: título + oro]
[Main Area: flex row]
  ├── [NPC Vendor: SVG + bocadillo + deck actual] ← 180px
  └── [Cards Grid: 4 cartas + 1 dado extra]
[Botón Continuar]
```

- **Zarkon el Mercader** (Fantasy) / **UNIT-7 MERCHANT** (Sci-Fi) — SVG de ~140×195px
- Bocadillo con frase aleatoria del vendedor (4 posibles)
- **Dado Extra**: 18 monedas, +1 dado permanente, máx. 8 dados
- Cartas: gradiente por tipo, icono grande, efecto hover elevado

### EventScreen
- Panel centrado con icono del evento, título, descripción
- 2 choices como botones (el primero con estilo primary)
- Al elegir: muestra resultado → botón Continuar

### WinLoseScreen
- Icono grande 🏆 o 💀
- Título con glow del color correspondiente
- Stats: HP restante, oro, turnos jugados
- Botones: Jugar de Nuevo, Menú Principal

---

## Animaciones

```css
/* Combate */
@keyframes enemyHit  { 0%,100%{transform:translateX(0)} 30%{transform:translateX(12px)} 70%{transform:translateX(-12px)} }
@keyframes playerHit { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-10px)} 70%{transform:translateX(10px)} }
@keyframes floatUp   { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-58px)} }
@keyframes dieRoll   { 0%,100%{transform:rotate(-5deg) scale(1.04)} 50%{transform:rotate(5deg) scale(1.04)} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
```

**Textos flotantes de daño:**
- Aparecen en posición fija (izquierda = enemigo, derecha = jugador)
- Animación `floatUp` 1.4s, luego eliminar del DOM
- Colores: daño en `t.accent`/`t.hp`, curación en `#44cc66`, oro en `t.gold`

---

## Persistencia (localStorage)

```typescript
localStorage.setItem('dd_user',    username)
localStorage.setItem('dd_state',   JSON.stringify(gameState))
localStorage.setItem('dd_tweaks',  JSON.stringify(tweaks))

// Al cargar:
const user  = localStorage.getItem('dd_user')
const state = JSON.parse(localStorage.getItem('dd_state') || 'null')
```

---

## Assets / Fuentes

Google Fonts requeridas:
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

Todos los sprites de personajes son **SVG inline** (sin imágenes externas). Los archivos de referencia contienen el SVG completo de:
- Jugador: `PlayerSprite` (knight fantasy / operative sci-fi)
- Slime Mecánico, Golem de Datos, Brujo Cibernético, Dragón de Circuitos
- Zarkon el Mercader / UNIT-7 MERCHANT

---

## Files de Referencia

| Archivo | Contenido |
|---|---|
| `game/data.js` | Todas las cartas, enemigos, eventos, mazo inicial |
| `game/Combat.jsx` | CombatScreen + Die + Card + HpBar + sprites |
| `game/ShopEvent.jsx` | ShopScreen + EventScreen + VendorNPC |
| `game/App.jsx` | LoginScreen + RegisterScreen + MenuScreen + TransitionScreen + WinLoseScreen + App router |
| `Dice Dungeon.html` | HTML de entrada, importa todos los scripts |

---

## Notas de Implementación para TypeScript

1. **Context API**: Usar `React.createContext<GameState | null>(null)` para el estado global
2. **Routing**: Usar un string enum `type Screen = 'login' | 'register' | 'menu' | 'transition' | 'combat' | 'shop' | 'event' | 'winlose'` y un switch en el componente raíz
3. **Async combat**: El turno de combate usa `async/await` con `setTimeout` para los delays visuales — mantener este patrón en TS con `Promise<void>`
4. **Canvas Matrix rain**: Implementar como custom hook `useMatrixRain(canvasRef, theme, isFantasy)` con cleanup en el return
5. **SVG sprites**: Copiar directamente los SVG inline de los archivos de referencia — son compatibles con JSX/TSX
6. **No hay backend**: Toda la persistencia es `localStorage`. No se requiere auth real.
