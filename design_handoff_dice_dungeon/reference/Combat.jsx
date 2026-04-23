// ============================================================
//  DICE DUNGEON — Pantalla de Combate
// ============================================================
const { useState, useEffect, useRef } = React;

// ── Sprites SVG ─────────────────────────────────────────────
function EnemySprite({ enemyId, theme, hit }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const glow = hit ? `drop-shadow(0 0 14px ${t.accent})` : `drop-shadow(0 0 6px ${t.gold}55)`;
  const sprites = {
    slime: (
      <svg viewBox="0 0 120 110" style={{ filter: glow, width: 110, height: 100 }}>
        <ellipse cx="60" cy="88" rx="52" ry="18" fill={F ? '#1a3a1a' : '#001a10'} opacity="0.5"/>
        <ellipse cx="60" cy="75" rx="50" ry="30" fill={F ? '#2e6e2e' : '#004433'}/>
        <ellipse cx="60" cy="62" rx="42" ry="36" fill={F ? '#3e9e3e' : '#006655'}/>
        <ellipse cx="60" cy="56" rx="34" ry="30" fill={F ? '#4aba4a' : '#008866'}/>
        {/* Ojos */}
        <circle cx="44" cy="50" r="9" fill="white"/><circle cx="46" cy="50" r="5" fill="#111"/>
        <circle cx="76" cy="50" r="9" fill="white"/><circle cx="78" cy="50" r="5" fill="#111"/>
        {F ? (
          <><rect x="50" y="32" width="9" height="9" rx="1" fill="#aaa" opacity="0.7"/>
          <rect x="61" y="30" width="9" height="9" rx="1" fill="#888" opacity="0.7"/>
          <path d="M48 68 Q60 76 72 68" stroke="#267026" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>
        ) : (
          <><circle cx="44" cy="50" r="4" fill={t.gold} opacity="0.9"/>
          <circle cx="76" cy="50" r="4" fill={t.gold} opacity="0.9"/>
          <path d="M28 75 L50 68 L70 74 L92 68" stroke={t.gold} strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M48 68 Q60 74 72 68" stroke={t.gold} strokeWidth="1.5" fill="none" opacity="0.4"/></>
        )}
      </svg>
    ),
    golem: (
      <svg viewBox="0 0 120 140" style={{ filter: glow, width: 110, height: 130 }}>
        <ellipse cx="60" cy="133" rx="40" ry="7" fill="#000" opacity="0.4"/>
        {/* Piernas */}
        <rect x="32" y="105" width="22" height="26" rx="3" fill={F ? '#556677' : '#151535'}/>
        <rect x="66" y="105" width="22" height="26" rx="3" fill={F ? '#556677' : '#151535'}/>
        {/* Cuerpo */}
        <rect x="22" y="44" width="76" height="64" rx="5" fill={F ? '#5a6a7a' : '#1a1a3a'}/>
        <rect x="30" y="52" width="60" height="48" rx="3" fill={F ? '#4a5a6a' : '#141430'}/>
        {/* Núcleo */}
        <circle cx="60" cy="76" r="13" fill={F ? '#6688aa' : t.accent} opacity="0.85"/>
        <circle cx="60" cy="76" r="7" fill={F ? '#aaccee' : t.gold} opacity="0.9"/>
        {/* Brazos */}
        <rect x="0" y="48" width="20" height="52" rx="6" fill={F ? '#4a5a6a' : '#141430'}/>
        <rect x="100" y="48" width="20" height="52" rx="6" fill={F ? '#4a5a6a' : '#141430'}/>
        {/* Cabeza */}
        <rect x="30" y="12" width="60" height="35" rx="5" fill={F ? '#5a6a7a' : '#1a1a3a'}/>
        {/* Ojos */}
        <rect x="36" y="19" width="18" height="12" rx="2" fill={F ? '#ffee55' : t.gold}/>
        <rect x="66" y="19" width="18" height="12" rx="2" fill={F ? '#ffee55' : t.gold}/>
        <rect x="40" y="21" width="10" height="8" rx="1" fill={F ? '#aa8800' : t.bg}/>
        <rect x="70" y="21" width="10" height="8" rx="1" fill={F ? '#aa8800' : t.bg}/>
        {!F && <><line x1="30" y1="40" x2="90" y2="40" stroke={t.gold} strokeWidth="1" opacity="0.3"/>
        <line x1="30" y1="55" x2="90" y2="55" stroke={t.gold} strokeWidth="0.5" opacity="0.2"/></>}
      </svg>
    ),
    brujo: (
      <svg viewBox="0 0 130 155" style={{ filter: glow, width: 120, height: 145 }}>
        <ellipse cx="65" cy="150" rx="38" ry="5" fill="#000" opacity="0.35"/>
        {/* Túnica */}
        <polygon points="20,155 110,155 95,55 35,55" fill={F ? '#2a1a5a' : '#0e003a'}/>
        <rect x="38" y="50" width="54" height="58" rx="4" fill={F ? '#3a2a6a' : '#15004a'}/>
        {/* Cabeza */}
        <ellipse cx="65" cy="38" rx="24" ry="22" fill={F ? '#6a5030' : '#28180a'}/>
        {/* Sombrero */}
        <polygon points="38,22 65,0 92,22" fill={F ? '#1a0a4a' : '#050018'}/>
        <rect x="30" y="22" width="70" height="8" rx="2" fill={F ? '#2a1a5a' : '#0e003a'}/>
        {/* Ojos brillantes */}
        <ellipse cx="53" cy="38" rx="8" ry="7" fill={F ? '#ff44aa' : t.accent}/>
        <ellipse cx="77" cy="38" rx="8" ry="7" fill={F ? '#ff44aa' : t.accent}/>
        <ellipse cx="53" cy="39" rx="4" ry="5" fill="#111"/>
        <ellipse cx="77" cy="39" rx="4" ry="5" fill="#111"/>
        {/* Bastón */}
        <line x1="100" y1="155" x2="108" y2="18" stroke={F ? '#8855cc' : t.gold} strokeWidth="5" strokeLinecap="round"/>
        <circle cx="108" cy="14" r="11" fill={F ? '#aa44ff' : t.gold} opacity="0.9"/>
        <circle cx="108" cy="14" r="6" fill={F ? '#cc88ff' : t.bg} opacity="0.8"/>
        {/* Detalles túnica */}
        <path d="M22 155 Q65 135 108 155" stroke={F ? '#7733bb' : t.accent} strokeWidth="2" fill="none" opacity="0.6"/>
        {!F && <><circle cx="60" cy="70" r="8" fill={t.accent} opacity="0.3"/>
        <circle cx="60" cy="70" r="4" fill={t.accent} opacity="0.5"/></>}
      </svg>
    ),
    dragon: (
      <svg viewBox="0 0 160 155" style={{ filter: glow, width: 150, height: 145 }}>
        <ellipse cx="80" cy="150" rx="55" ry="7" fill="#000" opacity="0.35"/>
        {/* Alas */}
        <polygon points="20,110 80,65 4,42" fill={F ? '#2a1000' : '#0a0018'} opacity="0.85"/>
        <polygon points="140,110 80,65 156,42" fill={F ? '#2a1000' : '#0a0018'} opacity="0.85"/>
        <polygon points="28,108 80,68 10,52" fill={F ? '#3a1800' : '#12002a'} opacity="0.6"/>
        <polygon points="132,108 80,68 150,52" fill={F ? '#3a1800' : '#12002a'} opacity="0.6"/>
        {/* Cola */}
        <path d="M125 125 Q148 105 138 80 Q128 55 150 42" stroke={F ? '#4a2010' : '#200040'} strokeWidth="14" fill="none" strokeLinecap="round"/>
        {/* Cuerpo */}
        <ellipse cx="80" cy="108" rx="50" ry="38" fill={F ? '#4a2010' : '#1e0a32'}/>
        {/* Cuello y cabeza */}
        <ellipse cx="80" cy="70" rx="22" ry="18" fill={F ? '#5a2818' : '#280d42'}/>
        <ellipse cx="80" cy="47" rx="32" ry="24" fill={F ? '#6a3020' : '#320f52'}/>
        {/* Mandíbula */}
        <ellipse cx="80" cy="60" rx="20" ry="10" fill={F ? '#5a2818' : '#240c3a'}/>
        {/* Ojos */}
        <ellipse cx="64" cy="42" rx="9" ry="7" fill={F ? '#ff7700' : t.gold}/>
        <ellipse cx="96" cy="42" rx="9" ry="7" fill={F ? '#ff7700' : t.gold}/>
        <ellipse cx="64" cy="43" rx="4" ry="5" fill="#111"/>
        <ellipse cx="96" cy="43" rx="4" ry="5" fill="#111"/>
        {/* Cuernos */}
        <polygon points="56,34 46,10 64,28" fill={F ? '#888' : t.accent}/>
        <polygon points="90,34 100,10 82,28" fill={F ? '#888' : t.accent}/>
        {/* Llama/Energía */}
        <ellipse cx="80" cy="64" rx="14" ry="6" fill={F ? '#ff7700' : t.accent} opacity="0.5"/>
        <ellipse cx="80" cy="62" rx="8" ry="4" fill={F ? '#ffcc00' : t.gold} opacity="0.6"/>
        {/* Escamas */}
        {F ? (
          <path d="M60 95 Q80 88 100 95 Q80 102 60 95Z" fill="#6a3020" opacity="0.5"/>
        ) : (
          <><path d="M45 108 Q80 98 115 108" stroke={t.gold} strokeWidth="1" fill="none" opacity="0.3"/>
          <path d="M50 118 Q80 110 110 118" stroke={t.accent} strokeWidth="1" fill="none" opacity="0.3"/></>
        )}
      </svg>
    ),
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: hit ? 'enemyHit 0.35s' : 'none' }}>
      {sprites[enemyId] || <div style={{ fontSize: 60 }}>👾</div>}
    </div>
  );
}

function PlayerSprite({ theme, hit }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: hit ? 'playerHit 0.35s' : 'none' }}>
      <svg viewBox="0 0 100 135" style={{ width: 90, height: 125, filter: hit ? `drop-shadow(0 0 10px ${t.hp})` : 'none' }}>
        {F ? (<>
          <ellipse cx="50" cy="130" rx="28" ry="5" fill="#000" opacity="0.35"/>
          {/* Botas */}
          <rect x="24" y="112" width="22" height="20" rx="3" fill="#445"/>
          <rect x="54" y="112" width="22" height="20" rx="3" fill="#445"/>
          {/* Piernas */}
          <rect x="26" y="92" width="20" height="22" rx="3" fill="#6a7a8a"/>
          <rect x="54" y="92" width="20" height="22" rx="3" fill="#6a7a8a"/>
          {/* Cuerpo */}
          <rect x="18" y="42" width="64" height="52" rx="4" fill="#7a8a9a"/>
          <rect x="26" y="48" width="48" height="40" rx="3" fill="#8a9aaa"/>
          {/* Gema central */}
          <circle cx="50" cy="65" r="9" fill={t.gold}/>
          <circle cx="50" cy="65" r="5" fill="#fff8d0" opacity="0.8"/>
          {/* Brazos */}
          <rect x="0" y="45" width="16" height="46" rx="5" fill="#6a7a8a"/>
          <rect x="84" y="45" width="16" height="46" rx="5" fill="#6a7a8a"/>
          {/* Escudo */}
          <ellipse cx="6" cy="76" rx="13" ry="16" fill={t.accent}/>
          <ellipse cx="6" cy="76" rx="8" ry="10" fill="#aa3312" opacity="0.6"/>
          <line x1="6" y1="62" x2="6" y2="90" stroke="#cc5533" strokeWidth="2"/>
          {/* Espada */}
          <line x1="98" y1="28" x2="92" y2="90" stroke="#ddd" strokeWidth="5" strokeLinecap="round"/>
          <rect x="86" y="52" width="14" height="6" rx="2" fill={t.gold}/>
          {/* Casco */}
          <rect x="26" y="8" width="48" height="38" rx="6" fill="#8a9a9a"/>
          <rect x="30" y="12" width="40" height="18" rx="3" fill="#6a7a7a"/>
          <rect x="28" y="26" width="44" height="12" rx="2" fill="#334"/>
          <line x1="50" y1="8" x2="50" y2="46" stroke="#7a8a8a" strokeWidth="3"/>
        </>) : (<>
          <ellipse cx="50" cy="130" rx="26" ry="5" fill="#000" opacity="0.35"/>
          {/* Botas */}
          <rect x="22" y="112" width="24" height="20" rx="3" fill="#0a0a22"/>
          <rect x="54" y="112" width="24" height="20" rx="3" fill="#0a0a22"/>
          <rect x="20" y="122" width="28" height="10" rx="2" fill="#050515"/>
          <rect x="52" y="122" width="28" height="10" rx="2" fill="#050515"/>
          {/* Piernas */}
          <rect x="24" y="92" width="20" height="22" rx="3" fill="#141430"/>
          <rect x="56" y="92" width="20" height="22" rx="3" fill="#141430"/>
          {/* Cuerpo */}
          <rect x="18" y="42" width="64" height="52" rx="5" fill="#1a1a3a"/>
          <rect x="26" y="48" width="48" height="44" rx="3" fill="#202045"/>
          {/* Display pecho */}
          <rect x="34" y="56" width="32" height="22" rx="2" fill="#050515"/>
          <rect x="36" y="58" width="12" height="3" rx="1" fill={t.gold}/>
          <rect x="36" y="63" width="22" height="3" rx="1" fill={t.accent}/>
          <rect x="36" y="68" width="16" height="3" rx="1" fill={t.gold} opacity="0.5"/>
          {/* Brazos */}
          <rect x="0" y="45" width="16" height="46" rx="5" fill="#141430"/>
          <rect x="84" y="45" width="16" height="46" rx="5" fill="#141430"/>
          {/* Pistola energía */}
          <rect x="84" y="55" width="32" height="11" rx="3" fill="#222248"/>
          <circle cx="117" cy="60" r="6" fill={t.accent} opacity="0.85"/>
          <rect x="90" y="66" width="20" height="4" rx="1" fill="#141430"/>
          {/* Casco */}
          <ellipse cx="50" cy="22" rx="27" ry="24" fill="#1a1a3a"/>
          <rect x="28" y="10" width="44" height="22" rx="10" fill="#252550"/>
          {/* Visor */}
          <rect x="30" y="16" width="40" height="12" rx="3" fill={t.gold} opacity="0.75"/>
          <rect x="32" y="18" width="14" height="8" rx="2" fill={t.bg} opacity="0.5"/>
          <rect x="54" y="18" width="14" height="8" rx="2" fill={t.bg} opacity="0.5"/>
        </>)}
      </svg>
    </div>
  );
}

// ── Dado ─────────────────────────────────────────────────────
const DOT_POSITIONS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,28],[72,28],[28,50],[72,50],[28,72],[72,72]],
};

function Die({ value, used, selected, rolling, onClick, theme, canSelect }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const dots = DOT_POSITIONS[value] || [];
  const borderColor = selected ? t.gold : used ? t.border : `${t.gold}88`;
  const bgColor     = selected ? `${t.gold}22` : used ? t.surface2 : t.diceBg;

  return (
    <div onClick={!used && !rolling && canSelect ? onClick : undefined}
      style={{ width: 68, height: 68, cursor: (!used && !rolling && canSelect) ? 'pointer' : 'default',
        opacity: used ? 0.3 : 1, transition: 'all 0.2s', position: 'relative',
        animation: rolling ? 'dieRoll 0.15s infinite' : selected ? 'none' : 'none',
        transform: selected ? 'scale(1.12) translateY(-4px)' : 'none',
        filter: selected ? `drop-shadow(0 0 8px ${t.gold})` : 'none',
      }}>
      <svg viewBox="0 0 100 100" style={{ width: 68, height: 68 }}>
        {F ? (
          <rect x="6" y="6" width="88" height="88" rx="14" fill={bgColor}
            stroke={borderColor} strokeWidth={selected ? 3.5 : 2}/>
        ) : (
          <rect x="6" y="6" width="88" height="88" rx="14" fill={bgColor}
            stroke={borderColor} strokeWidth={selected ? 3.5 : 2}/>
        )}
        {rolling
          ? <text x="50" y="64" textAnchor="middle" fontSize="38" fill={t.gold} fontFamily="monospace">?</text>
          : dots.map(([cx, cy], i) =>
              <circle key={i} cx={cx} cy={cy} r="8" fill={t.diceColor}/>)
        }
      </svg>
      {!rolling && value && (
        <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          color: selected ? t.gold : t.textDim, fontSize: 13, fontFamily: t.fontTitle, fontWeight: 700 }}>
          {value}
        </div>
      )}
    </div>
  );
}

// ── Carta ────────────────────────────────────────────────────
function Card({ card, activated, onClick, theme, canActivate, assignedDie, dimmed }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const rc = t.reqColor[card.type] || '#888';
  const rb = t.reqBg[card.type]   || t.surface;

  return (
    <div onClick={onClick}
      style={{
        width: 142, minHeight: 200, flexShrink: 0,
        background: activated ? `${rb}ee` : t.cardBg,
        border: `2px solid ${activated ? rc : (canActivate ? `${t.gold}99` : t.cardBorder)}`,
        borderRadius: F ? 7 : 2,
        padding: '10px 8px', cursor: (canActivate || activated) ? 'pointer' : 'default',
        transition: 'all 0.2s',
        transform: activated ? 'translateY(-10px) scale(1.04)' : canActivate ? 'translateY(-3px)' : 'none',
        boxShadow: activated ? `0 10px 28px ${rc}77` : canActivate ? `0 4px 14px ${t.gold}44` : 'none',
        opacity: dimmed ? 0.38 : 1,
        position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 6,
        userSelect: 'none',
      }}>
      {/* Barra tipo */}
      <div style={{ height: 3, background: rc, borderRadius: 1, marginBottom: 2 }}/>
      {/* Requisito badge */}
      <div style={{ background: rb, border: `1px solid ${rc}`, borderRadius: F ? 4 : 0,
        padding: '5px 6px', textAlign: 'center' }}>
        <div style={{ color: rc, fontFamily: t.fontTitle, fontSize: 17, fontWeight: 700, lineHeight: 1 }}>
          {card.reqLabel}
        </div>
        <div style={{ color: t.textDim, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
          {card.req.type === 'even' ? 'par' : card.req.type === 'odd' ? 'impar'
            : card.req.type === 'exact' ? 'exacto' : 'rango'}
        </div>
      </div>
      {/* Nombre */}
      <div style={{ color: t.text, fontFamily: t.fontTitle, fontSize: 11, fontWeight: 600,
        textAlign: 'center', lineHeight: 1.25 }}>
        {card.name}
      </div>
      {/* Efecto */}
      <div style={{ color: t.textDim, fontSize: 10.5, textAlign: 'center', flexGrow: 1,
        lineHeight: 1.35, fontFamily: t.fontBody }}>
        {card.desc}
      </div>
      {/* Dado asignado */}
      {assignedDie != null && (
        <div style={{ background: `${t.gold}22`, border: `1px solid ${t.gold}`,
          borderRadius: 4, padding: '3px 4px', textAlign: 'center',
          color: t.gold, fontFamily: t.fontTitle, fontSize: 12, fontWeight: 700 }}>
          🎲 {assignedDie}
        </div>
      )}
      {/* Check activada */}
      {activated && (
        <div style={{ position: 'absolute', top: -10, right: -10,
          background: rc, borderRadius: '50%', width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: t.bg, fontWeight: 700 }}>✓</div>
      )}
    </div>
  );
}

// ── Barra de HP ───────────────────────────────────────────────
function HpBar({ current, max, theme }) {
  const t = window.THEMES[theme];
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 60 ? '#44bb44' : pct > 30 ? '#ccaa22' : t.hp;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        color: t.textDim, fontSize: 12, marginBottom: 4, fontFamily: t.fontBody }}>
        <span>HP</span>
        <span style={{ color: t.text }}>{Math.max(0, current)} / {max}</span>
      </div>
      <div style={{ height: 10, background: t.hpBg, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color,
          transition: 'width 0.45s ease', borderRadius: 5,
          boxShadow: `0 0 8px ${color}88` }}/>
      </div>
    </div>
  );
}

// ── Textos flotantes ──────────────────────────────────────────
function FloatText({ text, color }) {
  return (
    <div style={{ color, fontSize: 26, fontWeight: 700,
      animation: 'floatUp 1.4s ease-out forwards',
      pointerEvents: 'none', fontFamily: 'monospace',
      textShadow: `0 0 12px ${color}`, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
}

// ── Combate Principal ─────────────────────────────────────────
function CombatScreen({ gameState, theme, tweaks, onEnd }) {
  const { ENEMIES, CARDS } = window.GameData;
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const enemy   = ENEMIES[Math.min(gameState.floor, 3)];
  const diceN   = gameState.diceCount || tweaks?.diceCount || 3;

  // ── Estado ──
  const [phase,         setPhase]         = useState('roll');
  const [enemyHp,       setEnemyHp]       = useState(enemy.maxHp);
  const [playerHp,      setPlayerHp]      = useState(gameState.playerHp);
  const [playerBlock,   setPlayerBlock]   = useState(0);
  const [playerReflect, setPlayerReflect] = useState(false);
  const [playerRegen,   setPlayerRegen]   = useState(0);
  const [enemyPoison,   setEnemyPoison]   = useState(0);
  const [dice,          setDice]          = useState([]);
  const [selDie,        setSelDie]        = useState(null);
  const [deck,          setDeck]          = useState([]);
  const [log,           setLog]           = useState([`⚔️ ¡Encuentras al ${enemy.name}!`]);
  const [gold,          setGold]          = useState(gameState.gold);
  const [turns,         setTurns]         = useState(gameState.totalTurns || 0);
  const [rolling,       setRolling]       = useState(false);
  const [enemyHit,      setEnemyHit]      = useState(false);
  const [playerHit,     setPlayerHit]     = useState(false);
  const [floatsL,       setFloatsL]       = useState([]); // enemy side
  const [floatsR,       setFloatsR]       = useState([]); // player side
  const logRef = useRef(null);

  // Inicializa mazo
  useEffect(() => {
    const ids = gameState.deck || [];
    const cards = ids.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
    setDeck(cards.map(c => ({ ...c, activated: false, assignedDie: null })));
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog   = msg => setLog(p => [...p.slice(-30), msg]);
  const addFloat = (text, color, side) => {
    const id = Date.now() + Math.random();
    const setter = side === 'enemy' ? setFloatsL : setFloatsR;
    setter(p => [...p, { id, text, color }]);
    setTimeout(() => setter(p => p.filter(f => f.id !== id)), 1500);
  };

  // ── Lanzar dados ──
  const rollDice = () => {
    if (phase !== 'roll') return;
    setRolling(true);
    setSelDie(null);
    setDeck(p => p.map(c => ({ ...c, activated: false, assignedDie: null })));
    const iv = setInterval(() => {
      setDice(Array(diceN).fill(0).map(() => ({ value: Math.ceil(Math.random()*6), used: false })));
    }, 120);
    setTimeout(() => {
      clearInterval(iv);
      const final = Array(diceN).fill(0).map(() => ({ value: Math.ceil(Math.random()*6), used: false }));
      setDice(final);
      setRolling(false);
      setPhase('assign');
      addLog(`🎲 Lanzas los dados: [${final.map(d => d.value).join(', ')}]`);
    }, 820);
  };

  // ── Seleccionar dado ──
  const selectDie = idx => {
    if (phase !== 'assign' || dice[idx]?.used) return;
    setSelDie(p => p === idx ? null : idx);
  };

  // ── Asignar dado a carta ──
  const assignDie = cardIdx => {
    if (phase !== 'assign') return;
    const card = deck[cardIdx];
    if (!card) return;
    // Deactivate si ya estaba activa
    if (card.activated) {
      const dv = card.assignedDie;
      setDeck(p => p.map((c, i) => i === cardIdx ? { ...c, activated: false, assignedDie: null } : c));
      setDice(p => p.map(d => (d.used && d.value === dv) ? { ...d, used: false } : d));
      addLog(`↩️ ${card.name} desactivada`);
      return;
    }
    if (selDie === null) return;
    const die = dice[selDie];
    if (!die || die.used) return;
    if (window.checkReq(die.value, card.req)) {
      const dv = die.value;
      setDeck(p => p.map((c, i) => i === cardIdx ? { ...c, activated: true, assignedDie: dv } : c));
      setDice(p => p.map((d, i) => i === selDie ? { ...d, used: true } : d));
      setSelDie(null);
      addLog(`✅ ${card.name} activada con [${dv}]`);
    } else {
      addLog(`❌ [${die.value}] no cumple "${card.reqLabel}" para ${card.name}`);
    }
  };

  // ── Fin de turno ──
  const endTurn = async () => {
    if (phase !== 'assign') return;
    setPhase('resolving');

    let eHp   = enemyHp;
    let pHp   = playerHp;
    let pGold = gold;
    let pBlock = 0;
    let pReflect = playerReflect;

    const active = deck.filter(c => c.activated);

    // Aplicar cartas
    for (const card of active) {
      await delay(380);
      const eff = card.effect;
      if (eff.damage) {
        const dmg = eff.damage * (eff.hits || 1);
        eHp = Math.max(0, eHp - dmg);
        setEnemyHp(eHp);
        triggerEnemyHit();
        addFloat(`−${dmg}`, t.accent, 'enemy');
        addLog(`⚔️ ${card.name}: ${dmg} de daño`);
      }
      if (eff.block) {
        pBlock += eff.block;
        setPlayerBlock(pBlock);
        addFloat(`🛡️ +${eff.block === 9999 ? '∞' : eff.block}`, '#4499ff', 'player');
        addLog(`🛡️ ${card.name}: ${eff.block === 9999 ? '∞' : eff.block} bloqueo`);
      }
      if (eff.heal) {
        pHp = Math.min(gameState.playerMaxHp, pHp + eff.heal);
        setPlayerHp(pHp);
        addFloat(`+${eff.heal} HP`, '#44cc66', 'player');
        addLog(`💚 ${card.name}: +${eff.heal} HP`);
      }
      if (eff.gold) {
        pGold += eff.gold;
        setGold(pGold);
        addFloat(`+${eff.gold} 🪙`, t.gold, 'player');
        addLog(`💰 ${card.name}: +${eff.gold} monedas`);
      }
      if (eff.reflect) {
        pReflect = true;
        setPlayerReflect(true);
        addLog(`🔄 ${card.name}: contraataque listo`);
      }
      if (eff.regen) {
        setPlayerRegen(eff.regen.turns);
        addLog(`🌿 ${card.name}: regeneración activa`);
      }
      if (eff.dot) {
        setEnemyPoison(p => p + eff.dot.turns);
        addLog(`☠️ ${card.name}: enemigo envenenado`);
      }
      if (eHp <= 0) break;
    }

    // Comprobar victoria
    if (eHp <= 0) { await endCombat(true, pHp, pGold); return; }

    // Veneno enemigo
    if (enemyPoison > 0) {
      await delay(300);
      eHp = Math.max(0, eHp - 2);
      setEnemyHp(eHp);
      setEnemyPoison(p => p - 1);
      addFloat('−2 ☠️', '#44cc44', 'enemy');
      addLog('☠️ Veneno: 2 de daño al enemigo');
      if (eHp <= 0) { await endCombat(true, pHp, pGold); return; }
    }

    // Regeneración jugador
    if (playerRegen > 0) {
      pHp = Math.min(gameState.playerMaxHp, pHp + 4);
      setPlayerHp(pHp);
      setPlayerRegen(p => p - 1);
      addFloat('+4 HP 🌿', '#44cc66', 'player');
    }

    // Ataque enemigo
    await delay(480);
    const rawAtk = enemy.attack;

    if (pReflect) {
      setPlayerReflect(false);
      eHp = Math.max(0, eHp - rawAtk);
      setEnemyHp(eHp);
      triggerEnemyHit();
      addFloat(`↩️ −${rawAtk}`, t.accent, 'enemy');
      addLog(`🔄 ¡Contraataque! ${rawAtk} devueltos al enemigo`);
      if (eHp <= 0) { await endCombat(true, pHp, pGold); return; }
    } else {
      const actual = Math.max(0, rawAtk - pBlock);
      pHp = Math.max(0, pHp - actual);
      setPlayerHp(pHp);
      if (actual > 0) { triggerPlayerHit(); addFloat(`−${actual}`, t.hp, 'player'); }
      const blockMsg = pBlock > 0 ? ` (bloqueaste ${Math.min(pBlock, rawAtk)})` : '';
      addLog(`💥 ${enemy.name} ataca: ${actual} de daño${blockMsg}`);
    }

    setPlayerBlock(0);
    if (pHp <= 0) { await endCombat(false, pHp, pGold); return; }

    // Siguiente turno
    await delay(400);
    setTurns(p => p + 1);
    setDeck(p => p.map(c => ({ ...c, activated: false, assignedDie: null })));
    setDice([]);
    setSelDie(null);
    setPhase('roll');
  };

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const triggerEnemyHit = () => {
    setEnemyHit(true);
    setTimeout(() => setEnemyHit(false), 400);
  };
  const triggerPlayerHit = () => {
    setPlayerHit(true);
    setTimeout(() => setPlayerHit(false), 400);
  };

  const endCombat = async (won, pHp, pGold) => {
    await delay(600);
    const earned = won ? pGold + enemy.gold : pGold;
    if (won) addLog(`🏆 ¡Derrotaste al ${enemy.name}! +${enemy.gold} monedas`);
    else addLog('💀 Has sido derrotado...');
    await delay(700);
    onEnd(won, { ...gameState, playerHp: pHp, gold: earned, totalTurns: turns + 1 });
  };

  const activatedCount = deck.filter(c => c.activated).length;
  const selDieVal = selDie !== null ? dice[selDie]?.value : null;

  // ── Render ──
  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: t.fontBody,
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Floats enemigo */}
      <div style={{ position: 'fixed', left: '26%', top: '30%', zIndex: 9000,
        display: 'flex', flexDirection: 'column', gap: 4, pointerEvents: 'none', alignItems: 'center' }}>
        {floatsL.map(f => <FloatText key={f.id} text={f.text} color={f.color}/>)}
      </div>
      {/* Floats jugador */}
      <div style={{ position: 'fixed', right: '24%', top: '30%', zIndex: 9000,
        display: 'flex', flexDirection: 'column', gap: 4, pointerEvents: 'none', alignItems: 'center' }}>
        {floatsR.map(f => <FloatText key={f.id} text={f.text} color={f.color}/>)}
      </div>

      {/* ── Header ── */}
      <div style={{ padding: '10px 24px', background: t.surface,
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: t.textDim, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', fontFamily: t.fontTitle }}>
          {F ? `Piso ${gameState.floor + 1} de 4` : `SECTOR ${gameState.floor + 1} / 4`}
          <span style={{ color: t.text, marginLeft: 12 }}>— {enemy.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 28, height: 7, borderRadius: 3,
              background: i <= gameState.floor ? t.gold : t.surface2,
              border: `1px solid ${t.border}`,
              boxShadow: i <= gameState.floor ? `0 0 6px ${t.gold}66` : 'none' }}/>
          ))}
          <div style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 15, marginLeft: 8 }}>
            🪙 {gold}
          </div>
        </div>
      </div>

      {/* ── Zona de batalla ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        padding: '16px 20px', gap: 14, overflow: 'hidden' }}>

        {/* Enemigo + Log + Jugador */}
        <div style={{ display: 'flex', gap: 14, flexShrink: 0, alignItems: 'stretch', height: 200 }}>

          {/* Panel jugador */}
          <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: F ? 5 : 2, padding: '14px 18px',
            display: 'flex', gap: 16, alignItems: 'center' }}>
            <PlayerSprite theme={theme} hit={playerHit}/>
            <div style={{ flex: 1 }}>
              <div style={{ color: t.text, fontFamily: t.fontTitle, fontSize: 17, fontWeight: 600, marginBottom: 3 }}>
                {F ? 'Tu Personaje' : 'OPERADOR'}
              </div>
              <div style={{ color: t.textDim, fontSize: 11, marginBottom: 12, fontStyle: 'italic' }}>
                {F ? 'Guerrero de los Dados' : 'Clase: Infiltrador Cuántico'}
              </div>
              <HpBar current={playerHp} max={gameState.playerMaxHp} theme={theme}/>
              <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: 11, flexWrap: 'wrap' }}>
                {playerBlock > 0 && <span style={{ color: '#4499ff' }}>🛡️ {playerBlock === 9999 ? '∞' : playerBlock}</span>}
                {playerReflect && <span style={{ color: '#aa88ff' }}>🔄 Reflejo</span>}
                {playerRegen > 0 && <span style={{ color: '#44cc66' }}>🌿 Regen ({playerRegen})</span>}
              </div>
            </div>
          </div>

          {/* Log */}
          <div style={{ width: 210, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: F ? 5 : 2, padding: '10px 12px',
            display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: t.textDim, fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', fontFamily: t.fontTitle, marginBottom: 8 }}>
              {F ? 'Registro' : 'BATTLE LOG'}
            </div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex',
              flexDirection: 'column', gap: 3 }}>
              {log.map((m, i) => (
                <div key={i} style={{ fontSize: 10.5, lineHeight: 1.4,
                  color: i === log.length - 1 ? t.text : t.textDim }}>{m}</div>
              ))}
            </div>
          </div>

          {/* Panel enemigo */}
          <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: F ? 5 : 2, padding: '14px 18px',
            display: 'flex', gap: 16, alignItems: 'center', flexDirection: 'row-reverse' }}>
            <EnemySprite enemyId={enemy.id} theme={theme} hit={enemyHit}/>
            <div style={{ flex: 1 }}>
              <div style={{ color: t.text, fontFamily: t.fontTitle, fontSize: 17, fontWeight: 600, marginBottom: 3 }}>
                {enemy.name}
              </div>
              <div style={{ color: t.textDim, fontSize: 11, marginBottom: 12, fontStyle: 'italic', lineHeight: 1.35 }}>
                {enemy.desc}
              </div>
              <HpBar current={enemyHp} max={enemy.maxHp} theme={theme}/>
              <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: 11 }}>
                <span style={{ color: t.textDim }}>⚔️ <span style={{ color: t.text }}>{enemy.attack}</span> atk/turno</span>
                {enemyPoison > 0 && <span style={{ color: '#44cc44' }}>☠️ Veneno ({enemyPoison})</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Dados ── */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: F ? 5 : 2, padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>

          <div style={{ color: t.textDim, fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', fontFamily: t.fontTitle, width: 70 }}>
            {F ? 'Dados' : 'DICE POOL'}
          </div>

          <div style={{ display: 'flex', gap: 30, paddingBottom: 24, flex: 1 }}>
            {(dice.length > 0 ? dice : Array(diceN).fill(null)).map((die, i) => (
              die
                ? <Die key={i} value={die.value} used={die.used} selected={selDie === i}
                    rolling={rolling} onClick={() => selectDie(i)} theme={theme}
                    canSelect={phase === 'assign' && !die.used}/>
                : <div key={i} style={{ width: 68, height: 68, opacity: 0.2 }}>
                    <svg viewBox="0 0 100 100" style={{ width: 68, height: 68 }}>
                      {F
                        ? <rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke={t.border} strokeWidth="2"/>
                        : <rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke={t.border} strokeWidth="2"/>}
                      <text x="50" y="64" textAnchor="middle" fontSize="36" fill={t.border} fontFamily="monospace">?</text>
                    </svg>
                  </div>
            ))}
          </div>

          {/* Controles */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            {phase === 'roll' && (
              <button onClick={rollDice} style={{
                padding: '11px 26px', background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
                color: t.btnText, fontFamily: t.fontTitle, fontSize: 13, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: F ? 3 : 0,
                boxShadow: `0 0 18px ${t.gold}44` }}>
                {F ? '🎲 Lanzar Dados' : '▶ LANZAR'}
              </button>
            )}
            {phase === 'assign' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ color: selDie !== null ? t.gold : t.textDim, fontSize: 11,
                  fontFamily: t.fontTitle, letterSpacing: '0.05em' }}>
                  {selDie !== null ? `[${selDieVal}] seleccionado` : 'Selecciona un dado'}
                </div>
                <button onClick={endTurn} style={{
                  padding: '11px 22px',
                  background: activatedCount > 0 ? t.buttonBg : 'transparent',
                  border: `1px solid ${activatedCount > 0 ? t.buttonBorder : t.border}`,
                  color: activatedCount > 0 ? t.btnText : t.textDim,
                  fontFamily: t.fontTitle, fontSize: 12, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', borderRadius: F ? 3 : 0 }}>
                  {F ? `Fin de Turno${activatedCount > 0 ? ` (${activatedCount})` : ''}`
                     : `FIN TURNO${activatedCount > 0 ? ` [${activatedCount}]` : ''}`}
                </button>
              </div>
            )}
            {phase === 'resolving' && (
              <div style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 13,
                letterSpacing: '0.12em', animation: 'pulse 0.8s infinite' }}>
                {F ? 'Resolviendo...' : 'PROCESANDO...'}
              </div>
            )}
          </div>
        </div>

        {/* ── Mano de cartas ── */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12,
          flexShrink: 0, justifyContent: deck.length <= 6 ? 'center' : 'flex-start' }}>
          {deck.map((card, i) => {
            const canActivate = phase === 'assign' && !card.activated
              && selDie !== null && !dice[selDie]?.used
              && window.checkReq(selDieVal, card.req);
            const dimmed = phase === 'assign' && !card.activated && selDie !== null
              && !window.checkReq(selDieVal, card.req);
            return (
              <Card key={i} card={card} activated={card.activated}
                onClick={() => phase === 'assign' && assignDie(i)}
                theme={theme} canActivate={canActivate || card.activated}
                assignedDie={card.assignedDie} dimmed={dimmed && !canActivate && !card.activated}/>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes enemyHit  { 0%,100%{transform:translateX(0)} 30%{transform:translateX(10px)} 70%{transform:translateX(-10px)} }
        @keyframes playerHit { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-8px)} 70%{transform:translateX(8px)} }
        @keyframes floatUp   { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-55px)} }
        @keyframes dieRoll   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

window.CombatScreen = CombatScreen;
