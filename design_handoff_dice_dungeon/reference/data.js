// ============================================================
//  DICE DUNGEON — Datos del juego + Temas visuales
// ============================================================

const THEMES = {
  fantasy: {
    bg: '#1a1008', surface: '#120c04', surface2: '#1f1505',
    border: '#4a3010', gold: '#d4a017', accent: '#c44b1a',
    accent2: '#8B6914', text: '#f0e6c8', textDim: '#9a8060',
    hp: '#c44b1a', hpBg: '#3a1a0a',
    fontTitle: "'Cinzel', serif", fontBody: "'Crimson Text', serif",
    cardBg: '#0d0904', cardBorder: '#5a3a10',
    diceColor: '#d4a017', diceBg: '#1f1505',
    buttonBg: 'linear-gradient(180deg, #c44b1a 0%, #8B3010 100%)',
    buttonBorder: '#e05520', btnText: '#fff0d0',
    success: '#5a9e2f',
    reqBg:    { attack: '#2a0a00', defense: '#001020', heal: '#002010', utility: '#1a0a2a' },
    reqColor: { attack: '#ff6633', defense: '#4499ff', heal: '#33dd77', utility: '#cc88ff' },
    name: 'Oscuridad de Fantasía',
  },
  scifi: {
    bg: '#050510', surface: '#0a0a1a', surface2: '#0f0f22',
    border: '#1a1a3a', gold: '#00ffcc', accent: '#ff00aa',
    accent2: '#0088ff', text: '#e0f0ff', textDim: '#8090b0',
    hp: '#ff3366', hpBg: '#200010',
    fontTitle: "'Orbitron', sans-serif", fontBody: "'Rajdhani', sans-serif",
    cardBg: '#07071a', cardBorder: '#2a2a5a',
    diceColor: '#00ffcc', diceBg: '#0a0a1a',
    buttonBg: 'linear-gradient(180deg, #0055cc 0%, #003388 100%)',
    buttonBorder: '#0088ff', btnText: '#e0f0ff',
    success: '#00ff88',
    reqBg:    { attack: '#200010', defense: '#001020', heal: '#002020', utility: '#100020' },
    reqColor: { attack: '#ff3366', defense: '#00aaff', heal: '#00ff88', utility: '#aa44ff' },
    name: 'Neón Sci-Fi',
  },
};

function checkReq(dieValue, req) {
  if (!req) return true;
  switch (req.type) {
    case 'even':  return dieValue % 2 === 0;
    case 'odd':   return dieValue % 2 !== 0;
    case 'exact': return dieValue === req.value;
    case 'range': return dieValue >= req.min && dieValue <= req.max;
    default:      return false;
  }
}

// ── CARTAS ──────────────────────────────────────────────────
const CARDS = [
  // ── Ataque ──
  { id: 'golpe_basico',   name: 'Impacto Binario',     icon: '⚡', type: 'attack',
    req: { type: 'even' },              reqLabel: 'PAR',
    effect: { damage: 4 },             desc: 'Descarga binaria que inflige 4 de daño' },
  { id: 'ataque_preciso', name: 'Precisión Letal',     icon: '🎯', type: 'attack',
    req: { type: 'exact', value: 4 },  reqLabel: '= 4',
    effect: { damage: 7 },             desc: 'Golpe calculado al milímetro. 7 de daño' },
  { id: 'furia',          name: 'Sobrecarga Crítica',  icon: '💥', type: 'attack',
    req: { type: 'exact', value: 6 },  reqLabel: '= 6',
    effect: { damage: 12 },            desc: 'Sistema al límite. 12 de daño masivo' },
  { id: 'doble_golpe',    name: 'Combo Digital',       icon: '⚔️', type: 'attack',
    req: { type: 'range', min: 3, max: 6 }, reqLabel: '3 – 6',
    effect: { damage: 4, hits: 2 },    desc: 'Dos impactos rápidos de 4 cada uno' },
  { id: 'electro',        name: 'Rayo de Datos',       icon: '🌩️', type: 'attack',
    req: { type: 'even' },             reqLabel: 'PAR',
    effect: { damage: 7 },             desc: 'Pulso eléctrico que fríe circuitos. 7 daño' },
  { id: 'explosion',      name: 'Bomba de Código',     icon: '💣', type: 'attack',
    req: { type: 'range', min: 5, max: 6 }, reqLabel: '5 – 6',
    effect: { damage: 14 },            desc: 'Payload explosivo. 14 de daño total' },
  { id: 'veneno',         name: 'Virus Corrupto',      icon: '🧪', type: 'attack',
    req: { type: 'range', min: 4, max: 5 }, reqLabel: '4 – 5',
    effect: { damage: 2, dot: { dmg: 2, turns: 3 } }, desc: '2 daño + corrupción (2/turno × 3)' },
  // ── Defensa ──
  { id: 'escudo',         name: 'Firewall Básico',     icon: '🛡️', type: 'defense',
    req: { type: 'odd' },              reqLabel: 'IMPAR',
    effect: { block: 6 },              desc: 'Activa el firewall. Bloquea 6 de daño' },
  { id: 'barrera',        name: 'Muro de Datos',       icon: '🏰', type: 'defense',
    req: { type: 'exact', value: 1 },  reqLabel: '= 1',
    effect: { block: 16 },             desc: 'Barrera maciza. Absorbe 16 de daño' },
  { id: 'escudo_magico',  name: 'Barrera Cuántica',   icon: '✨', type: 'defense',
    req: { type: 'exact', value: 3 },  reqLabel: '= 3',
    effect: { block: 9999 },           desc: 'Campo cuántico. Bloquea TODO el daño' },
  { id: 'contraataque',   name: 'Protocolo Reflejo',  icon: '🔄', type: 'defense',
    req: { type: 'exact', value: 5 },  reqLabel: '= 5',
    effect: { reflect: true },         desc: 'Devuelve el próximo ataque al remitente' },
  // ── Curación ──
  { id: 'curacion',       name: 'Corrección de Código', icon: '💚', type: 'heal',
    req: { type: 'range', min: 1, max: 3 }, reqLabel: '1 – 3',
    effect: { heal: 6 },               desc: 'Parchea los errores críticos. +6 HP' },
  { id: 'gran_curacion',  name: 'Reparación Total',   icon: '💊', type: 'heal',
    req: { type: 'exact', value: 2 },  reqLabel: '= 2',
    effect: { heal: 14 },              desc: 'Restauración completa del sistema. +14 HP' },
  { id: 'regeneracion',   name: 'Auto-Reparación',    icon: '🌿', type: 'heal',
    req: { type: 'exact', value: 1 },  reqLabel: '= 1',
    effect: { regen: { hp: 4, turns: 3 } }, desc: 'Nanobots activos. +4 HP/turno × 3' },
  // ── Utilidad ──
  { id: 'pickpocket',     name: 'Hackeo Financiero',  icon: '💰', type: 'utility',
    req: { type: 'odd' },              reqLabel: 'IMPAR',
    effect: { gold: 6 },               desc: 'Drena 6 créditos del enemigo' },
];

// ── ENEMIGOS ────────────────────────────────────────────────
const ENEMIES = [
  { id: 'slime',  name: 'Slime Mecánico',    maxHp: 24,  attack: 4,  gold: 7,
    desc: 'Una masa de metal líquido y código corrupto', tier: 1 },
  { id: 'golem',  name: 'Golem de Datos',    maxHp: 42,  attack: 7,  gold: 12,
    desc: 'Construido con fragmentos de código antiguo y acero fundido', tier: 2 },
  { id: 'brujo',  name: 'Brujo Cibernético', maxHp: 58,  attack: 10, gold: 18,
    desc: 'Magia arcana y circuitos cuánticos fusionados en un ser eterno', tier: 3 },
  { id: 'dragon', name: 'Dragón de Circuitos', maxHp: 92, attack: 14, gold: 30,
    desc: 'El señor supremo de la mazmorra digital. Su aliento destruye mundos', tier: 4 },
];

// ── TIENDA ──────────────────────────────────────────────────
const SHOP_POOL = [
  'furia', 'gran_curacion', 'veneno', 'explosion',
  'contraataque', 'electro', 'escudo_magico', 'regeneracion',
  'doble_golpe', 'barrera', 'pickpocket',
];

// ── EVENTOS ─────────────────────────────────────────────────
const EVENTS = [
  {
    id: 'mercader', icon: '🧙', title: 'Mercader Misterioso',
    desc: 'Un extraño comerciante emerge de las sombras. Su sonrisa oculta algo... ¿confías en él?',
    choices: [
      { text: 'Aceptar su oferta  (+8 monedas)', effect: { gold: 8 },  result: '¡Recibes 8 monedas de oro!' },
      { text: 'Ignorar y seguir',                effect: {},            result: 'Sigues tu camino sin novedades.' },
    ],
  },
  {
    id: 'trampa', icon: '⚙️', title: 'Trampa Mecánica',
    desc: 'El suelo tiembla bajo tus pies. Cuchillas y dardos emergen de las paredes a tu alrededor.',
    choices: [
      { text: 'Esquivar rápido  (-5 HP)',    effect: { damage: 5 },  result: 'Esquivas... pero te lastimas. −5 HP.' },
      { text: 'Forzar el paso  (-12 HP)',    effect: { damage: 12 }, result: 'Lo atraviesas a la fuerza. −12 HP.' },
    ],
  },
  {
    id: 'altar', icon: '⛩️', title: 'Altar Ancestral',
    desc: 'Un altar antiguo pulsa con energía mística. Promete poder a cambio de sacrificio de oro.',
    choices: [
      { text: 'Ofrecer 8 oro → carta gratis', effect: { cost: 8, card: true }, result: '¡El altar te otorga una carta nueva!' },
      { text: 'Ignorar el altar',             effect: {},                       result: 'Continúas sin tocar nada.' },
    ],
  },
  {
    id: 'campamento', icon: '🏕️', title: 'Campamento Seguro',
    desc: 'Encuentras un refugio protegido con suministros médicos y nanobots de reparación.',
    choices: [
      { text: 'Descansar  (+15 HP)',  effect: { heal: 15 }, result: '¡Recuperas 15 HP!' },
      { text: 'Seguir adelante',      effect: {},           result: 'Decides no perder tiempo.' },
    ],
  },
];

// ── MAZO INICIAL ────────────────────────────────────────────
const STARTER_DECK = ['golpe_basico', 'escudo', 'curacion', 'ataque_preciso', 'doble_golpe'];

// ── EXPORTS ─────────────────────────────────────────────────
window.GameData  = { CARDS, ENEMIES, SHOP_POOL, EVENTS, STARTER_DECK };
window.THEMES    = THEMES;
window.checkReq  = checkReq;
