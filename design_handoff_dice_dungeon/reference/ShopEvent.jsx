// ============================================================
//  DICE DUNGEON — Tienda y Eventos (Rediseño)
// ============================================================
const { useState: useStateShop } = React;

// ── Precio por tipo ───────────────────────────────────────────
function cardPrice(card) {
  const base = { attack: 8, defense: 7, heal: 9, utility: 6 };
  return (base[card?.type] || 8) + Math.floor(Math.random() * 5);
}

// ── NPC Vendedor SVG ──────────────────────────────────────────
function VendorNPC({ theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  return (
    <svg viewBox="0 0 160 220" style={{ width: 140, height: 195, filter: `drop-shadow(0 0 12px ${t.gold}55)` }}>
      {F ? (<>
        {/* Sombra */}
        <ellipse cx="80" cy="212" rx="40" ry="8" fill="#000" opacity="0.3"/>
        {/* Cuerpo túnica */}
        <polygon points="30,220 130,220 118,95 42,95" fill="#2a1a5a"/>
        <polygon points="38,220 122,220 112,100 48,100" fill="#3a2a7a"/>
        {/* Detalles túnica */}
        <polygon points="70,220 90,220 82,150 78,150" fill="#d4a017" opacity="0.6"/>
        <polygon points="48,220 62,220 56,180 50,180" fill="#d4a017" opacity="0.3"/>
        <polygon points="98,220 112,220 110,180 104,180" fill="#d4a017" opacity="0.3"/>
        {/* Brazos */}
        <path d="M42 105 Q15 130 20 160" stroke="#3a2a7a" strokeWidth="18" fill="none" strokeLinecap="round"/>
        <path d="M118 105 Q145 130 140 160" stroke="#3a2a7a" strokeWidth="18" fill="none" strokeLinecap="round"/>
        {/* Mano izq con dado */}
        <rect x="6" y="152" width="22" height="22" rx="4" fill="#d4a017"/>
        <circle cx="10" cy="156" r="2" fill="#1a1008"/><circle cx="17" cy="163" r="2" fill="#1a1008"/><circle cx="24" cy="170" r="2" fill="#1a1008"/>
        {/* Mano der con carta */}
        <rect x="130" y="148" width="20" height="28" rx="3" fill="#f0e6c8"/>
        <rect x="132" y="150" width="16" height="8" rx="1" fill="#c44b1a" opacity="0.8"/>
        <rect x="133" y="162" width="14" height="2" rx="1" fill="#9a8060"/>
        <rect x="133" y="166" width="10" height="2" rx="1" fill="#9a8060"/>
        {/* Cabeza */}
        <ellipse cx="80" cy="72" rx="32" ry="30" fill="#6a5030"/>
        <ellipse cx="80" cy="68" rx="28" ry="26" fill="#7a6040"/>
        {/* Sombrero mago */}
        <ellipse cx="80" cy="45" rx="36" ry="10" fill="#1a0a4a"/>
        <polygon points="55,45 80,5 105,45" fill="#1a0a4a"/>
        <ellipse cx="80" cy="45" rx="36" ry="10" fill="#2a1a6a"/>
        {/* Estrella sombrero */}
        <circle cx="80" cy="22" r="5" fill="#d4a017" opacity="0.9"/>
        {/* Ojos simpáticos */}
        <ellipse cx="67" cy="70" rx="9" ry="10" fill="white"/>
        <ellipse cx="93" cy="70" rx="9" ry="10" fill="white"/>
        <circle cx="69" cy="71" r="5" fill="#2a1a00"/>
        <circle cx="95" cy="71" r="5" fill="#2a1a00"/>
        <circle cx="71" cy="69" r="2" fill="white"/>
        <circle cx="97" cy="69" r="2" fill="white"/>
        {/* Cejas */}
        <path d="M58 62 Q67 59 76 62" stroke="#5a3a10" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M84 62 Q93 59 102 62" stroke="#5a3a10" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Nariz */}
        <ellipse cx="80" cy="78" rx="5" ry="4" fill="#8a6a40"/>
        {/* Sonrisa */}
        <path d="M64 85 Q80 96 96 85" stroke="#5a3a10" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Bigote */}
        <path d="M66 82 Q72 80 78 82" stroke="#9a7a50" strokeWidth="2" fill="none"/>
        <path d="M82 82 Q88 80 94 82" stroke="#9a7a50" strokeWidth="2" fill="none"/>
        {/* Barba */}
        <path d="M62 90 Q80 108 98 90" stroke="#9a7a50" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </>) : (<>
        {/* Sombra */}
        <ellipse cx="80" cy="212" rx="38" ry="7" fill="#000" opacity="0.3"/>
        {/* Cuerpo robot */}
        <rect x="35" y="95" width="90" height="110" rx="8" fill="#1a1a3a"/>
        <rect x="42" y="102" width="76" height="96" rx="5" fill="#202045"/>
        {/* Panel pecho */}
        <rect x="50" y="115" width="60" height="50" rx="4" fill="#050515"/>
        {/* Display */}
        <rect x="54" y="119" width="52" height="16" rx="2" fill="#001a10"/>
        <rect x="56" y="121" width="20" height="3" rx="1" fill="#00ffcc"/>
        <rect x="56" y="126" width="35" height="3" rx="1" fill="#00ffcc" opacity="0.6"/>
        <rect x="56" y="131" width="28" height="3" rx="1" fill="#ff00aa" opacity="0.5"/>
        {/* Botones */}
        <circle cx="62" cy="148" r="5" fill="#ff00aa" opacity="0.8"/>
        <circle cx="80" cy="148" r="5" fill="#00ffcc" opacity="0.8"/>
        <circle cx="98" cy="148" r="5" fill="#0088ff" opacity="0.8"/>
        <rect x="56" y="158" width="48" height="6" rx="2" fill="#0a0a2a"/>
        {/* Brazos */}
        <rect x="5" y="100" width="28" height="70" rx="8" fill="#141430"/>
        <rect x="127" y="100" width="28" height="70" rx="8" fill="#141430"/>
        {/* Articulaciones */}
        <circle cx="19" cy="135" r="8" fill="#1a1a3a"/>
        <circle cx="141" cy="135" r="8" fill="#1a1a3a"/>
        {/* Mano izq con dado */}
        <rect x="4" y="162" width="24" height="24" rx="5" fill="#00ffcc" opacity="0.9"/>
        <circle cx="8"  cy="166" r="2.5" fill="#050515"/>
        <circle cx="16" cy="174" r="2.5" fill="#050515"/>
        <circle cx="24" cy="166" r="2.5" fill="#050515"/>
        {/* Mano der con carta */}
        <rect x="128" y="158" width="22" height="30" rx="3" fill="#e0f0ff"/>
        <rect x="130" y="160" width="18" height="9" rx="1" fill="#ff00aa" opacity="0.8"/>
        <rect x="131" y="173" width="16" height="2" rx="1" fill="#8090b0"/>
        <rect x="131" y="177" width="12" height="2" rx="1" fill="#8090b0"/>
        {/* Piernas */}
        <rect x="42" y="202" width="30" height="16" rx="5" fill="#141430"/>
        <rect x="88" y="202" width="30" height="16" rx="5" fill="#141430"/>
        {/* Cabeza */}
        <rect x="42" y="30" width="76" height="68" rx="12" fill="#1a1a3a"/>
        <rect x="48" y="36" width="64" height="56" rx="8" fill="#20204a"/>
        {/* Antena */}
        <line x1="80" y1="30" x2="80" y2="10" stroke="#00ffcc" strokeWidth="3"/>
        <circle cx="80" cy="8" r="6" fill="#00ffcc" opacity="0.9"/>
        <circle cx="80" cy="8" r="3" fill="white"/>
        {/* Ojos pantalla */}
        <rect x="52" y="48" width="24" height="18" rx="4" fill="#001520"/>
        <rect x="84" y="48" width="24" height="18" rx="4" fill="#001520"/>
        <rect x="54" y="50" width="20" height="14" rx="3" fill="#00ffcc" opacity="0.85"/>
        <rect x="86" y="50" width="20" height="14" rx="3" fill="#00ffcc" opacity="0.85"/>
        {/* Pupilas */}
        <rect x="60" y="53" width="8" height="8" rx="2" fill="#005540"/>
        <rect x="92" y="53" width="8" height="8" rx="2" fill="#005540"/>
        {/* Boca LED */}
        <rect x="58" y="76" width="44" height="8" rx="3" fill="#001a10"/>
        <rect x="60" y="78" width="6" height="4" rx="1" fill="#00ffcc"/>
        <rect x="68" y="78" width="6" height="4" rx="1" fill="#00ffcc"/>
        <rect x="76" y="78" width="6" height="4" rx="1" fill="#00ffcc"/>
        <rect x="84" y="78" width="6" height="4" rx="1" fill="#00ffcc"/>
        <rect x="92" y="78" width="6" height="4" rx="1" fill="#00ffcc"/>
        {/* Orejas/altavoces */}
        <rect x="30" y="45" width="14" height="30" rx="5" fill="#141430"/>
        <rect x="116" y="45" width="14" height="30" rx="5" fill="#141430"/>
        <circle cx="37" cy="60" r="4" fill="#00ffcc" opacity="0.4"/>
        <circle cx="123" cy="60" r="4" fill="#00ffcc" opacity="0.4"/>
      </>)}
    </svg>
  );
}

// ── Carta de tienda mejorada ───────────────────────────────────
function ShopCard({ card, price, bought, canAfford, onBuy, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const rc = t.reqColor[card.type] || '#888';
  const rb = t.reqBg[card.type]   || t.surface;
  const [hovered, setHovered] = useStateShop(false);

  const typeLabel = { attack: 'ATAQUE', defense: 'DEFENSA', heal: 'CURACIÓN', utility: 'UTILIDAD' };

  // Gradiente por tipo
  const gradColors = {
    attack:  ['#2a0800', '#1a0400'],
    defense: ['#001030', '#000820'],
    heal:    ['#003018', '#001a0a'],
    utility: ['#1a0a30', '#0d0520'],
  };
  const [gc1, gc2] = gradColors[card.type] || ['#0d0904', '#070503'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Precio */}
      <div style={{
        padding: '5px 16px', borderRadius: 20,
        background: bought ? '#1a3a1a' : canAfford ? t.gold : t.surface2,
        color:      bought ? '#44cc66' : canAfford ? t.bg   : t.textDim,
        fontFamily: t.fontTitle, fontSize: 13, fontWeight: 700,
        boxShadow: !bought && canAfford ? `0 0 14px ${t.gold}55` : 'none',
      }}>
        {bought ? '✓ En tu mazo' : `🪙 ${price}`}
      </div>

      {/* Carta */}
      <div
        onClick={() => !bought && canAfford && onBuy()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 148, minHeight: 225,
          background: `linear-gradient(160deg, ${gc1} 0%, ${gc2} 100%)`,
          border: `2px solid ${bought ? '#2a5a2a' : hovered && canAfford ? rc : `${rc}66`}`,
          borderRadius: F ? 10 : 3,
          padding: '0 0 12px 0',
          cursor: !bought && canAfford ? 'pointer' : 'default',
          opacity: bought ? 0.55 : canAfford ? 1 : 0.42,
          transition: 'all 0.22s',
          transform: hovered && canAfford && !bought ? 'translateY(-6px) scale(1.03)' : 'none',
          boxShadow: hovered && canAfford && !bought
            ? `0 12px 32px ${rc}66, 0 0 0 1px ${rc}44`
            : bought ? 'none' : `0 4px 16px #00000066`,
          display: 'flex', flexDirection: 'column',
          userSelect: 'none', overflow: 'hidden',
          position: 'relative',
        }}>

        {/* Header de color */}
        <div style={{
          background: `linear-gradient(90deg, ${rc}dd, ${rc}88)`,
          padding: '8px 10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: t.bg, fontFamily: t.fontTitle, fontWeight: 700, opacity: 0.85 }}>
            {typeLabel[card.type]}
          </span>
          <span style={{ fontSize: 18 }}>{card.icon}</span>
        </div>

        {/* Icono grande */}
        <div style={{ textAlign: 'center', padding: '14px 0 8px', fontSize: 42,
          filter: `drop-shadow(0 0 10px ${rc}88)` }}>
          {card.icon}
        </div>

        {/* Nombre */}
        <div style={{ color: '#fff', fontFamily: t.fontTitle, fontSize: 12, fontWeight: 700,
          textAlign: 'center', lineHeight: 1.25, padding: '0 8px 8px' }}>
          {card.name}
        </div>

        {/* Requisito */}
        <div style={{ margin: '0 10px 8px', background: rb,
          border: `1px solid ${rc}`, borderRadius: F ? 5 : 2,
          padding: '5px 8px', textAlign: 'center' }}>
          <div style={{ color: rc, fontFamily: t.fontTitle, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
            {card.reqLabel}
          </div>
          <div style={{ color: `${rc}99`, fontSize: 9, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginTop: 2 }}>
            {card.req.type === 'even' ? 'número par' : card.req.type === 'odd' ? 'número impar'
              : card.req.type === 'exact' ? 'valor exacto' : 'rango'}
          </div>
        </div>

        {/* Descripción */}
        <div style={{ color: `${rc}cc`, fontSize: 10, textAlign: 'center',
          lineHeight: 1.4, padding: '0 10px', fontFamily: t.fontBody, fontStyle: 'italic' }}>
          {card.desc}
        </div>

        {/* Brillo al hover */}
        {hovered && canAfford && !bought && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 20%, ${rc}22 0%, transparent 70%)` }}/>
        )}
      </div>
    </div>
  );
}

// ── Item: Dado Extra ──────────────────────────────────────────
function DiceUpgradeItem({ currentDice, gold, onBuy, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const PRICE = 18;
  const maxed = currentDice >= 8;
  const canAfford = gold >= PRICE && !maxed;
  const [hovered, setHovered] = useStateShop(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        padding: '5px 16px', borderRadius: 20,
        background: maxed ? '#2a2a1a' : canAfford ? t.gold : t.surface2,
        color:      maxed ? t.textDim : canAfford ? t.bg   : t.textDim,
        fontFamily: t.fontTitle, fontSize: 13, fontWeight: 700,
        boxShadow: canAfford ? `0 0 14px ${t.gold}55` : 'none',
      }}>
        {maxed ? '🎲 MAX (8)' : `🪙 ${PRICE}`}
      </div>

      <div
        onClick={() => canAfford && onBuy()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 148, minHeight: 225,
          background: 'linear-gradient(160deg, #1a1400, #0d0a00)',
          border: `2px solid ${maxed ? t.border : hovered && canAfford ? t.gold : `${t.gold}55`}`,
          borderRadius: F ? 10 : 3,
          padding: '0 0 12px 0',
          cursor: canAfford ? 'pointer' : 'default',
          opacity: maxed ? 0.45 : canAfford ? 1 : 0.42,
          transition: 'all 0.22s',
          transform: hovered && canAfford ? 'translateY(-6px) scale(1.03)' : 'none',
          boxShadow: hovered && canAfford
            ? `0 12px 32px ${t.gold}55, 0 0 0 1px ${t.gold}44`
            : `0 4px 16px #00000066`,
          display: 'flex', flexDirection: 'column',
          userSelect: 'none', overflow: 'hidden',
          position: 'relative',
        }}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(90deg, ${t.gold}dd, ${t.gold}88)`,
          padding: '8px 10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: t.bg, fontFamily: t.fontTitle, fontWeight: 700 }}>ESPECIAL</span>
          <span style={{ fontSize: 18 }}>🎲</span>
        </div>

        {/* Dado grande */}
        <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
          <svg viewBox="0 0 80 80" style={{ width: 56, height: 56,
            filter: `drop-shadow(0 0 10px ${t.gold}88)` }}>
            <rect x="4" y="4" width="72" height="72" rx="12" fill={t.diceBg}
              stroke={t.gold} strokeWidth="3"/>
            <circle cx="20" cy="20" r="7" fill={t.diceColor}/>
            <circle cx="40" cy="40" r="7" fill={t.diceColor}/>
            <circle cx="60" cy="60" r="7" fill={t.diceColor}/>
            <circle cx="60" cy="20" r="7" fill={t.diceColor}/>
            <circle cx="20" cy="60" r="7" fill={t.diceColor}/>
            {/* + sign */}
            <text x="40" y="58" textAnchor="middle" fontSize="28" fill={t.gold}
              fontFamily="monospace" fontWeight="bold">+</text>
          </svg>
        </div>

        {/* Nombre */}
        <div style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 12, fontWeight: 700,
          textAlign: 'center', lineHeight: 1.25, padding: '4px 8px 8px' }}>
          {F ? 'Dado Extra' : 'DADO ADICIONAL'}
        </div>

        {/* Info */}
        <div style={{ margin: '0 10px 8px', background: `${t.gold}11`,
          border: `1px solid ${t.gold}55`, borderRadius: F ? 5 : 2,
          padding: '5px 8px', textAlign: 'center' }}>
          <div style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 14, fontWeight: 700 }}>
            {currentDice} → {Math.min(currentDice + 1, 8)}
          </div>
          <div style={{ color: `${t.gold}88`, fontSize: 9, textTransform: 'uppercase',
            letterSpacing: '0.08em', marginTop: 2 }}>
            dados por turno
          </div>
        </div>

        <div style={{ color: `${t.gold}99`, fontSize: 10, textAlign: 'center',
          padding: '0 10px', fontFamily: t.fontBody, fontStyle: 'italic', lineHeight: 1.4 }}>
          {maxed ? 'Ya tienes el máximo de dados posible'
            : 'Añade un dado más a tu reserva permanente'}
        </div>

        {hovered && canAfford && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 20%, ${t.gold}22 0%, transparent 70%)` }}/>
        )}
      </div>
    </div>
  );
}

// ── Tienda ────────────────────────────────────────────────────
function ShopScreen({ gameState, theme, onDone }) {
  const { CARDS, SHOP_POOL } = window.GameData;
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';

  const [gold,      setGold]   = useStateShop(gameState.gold);
  const [deck,      setDeck]   = useStateShop([...gameState.deck]);
  const [bought,    setBought] = useStateShop([]);
  const [diceCount, setDiceCount] = useStateShop(gameState.diceCount || 3);
  const [diceBought, setDiceBought] = useStateShop(false);

  const VENDOR_LINES = F
    ? ['¡Bienvenido, valiente! Tengo exactamente lo que necesitas...', '¡Mis cartas son las mejores de la mazmorra!', '¿Oro por poder? ¡Trato justo!', 'El destino te ha traído aquí. ¡Elige bien!']
    : ['UNIDAD MERCANTIL-7 EN LÍNEA. Inventario disponible.', 'Procesando catálogo... Ofertas óptimas calculadas.', 'Transacción segura garantizada. Sin virus (probablemente).', 'Datos = poder. ¿Adquieres protocolos nuevos?'];
  const [vendorLine] = useStateShop(() => VENDOR_LINES[Math.floor(Math.random() * VENDOR_LINES.length)]);

  const [shopCards] = useStateShop(() => {
    const shuffled = [...SHOP_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(id => ({
      ...CARDS.find(c => c.id === id),
      price: cardPrice(CARDS.find(c => c.id === id)),
    })).filter(c => c.id);
  });

  const buyCard = (card) => {
    if (gold < card.price || bought.includes(card.id)) return;
    setGold(g => g - card.price);
    setDeck(d => [...d, card.id]);
    setBought(b => [...b, card.id]);
  };

  const buyDice = () => {
    if (gold < 18 || diceCount >= 8 || diceBought) return;
    setGold(g => g - 18);
    setDiceCount(d => Math.min(d + 1, 8));
    setDiceBought(true);
  };

  const deckCards = deck.map(id => CARDS.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: t.fontBody,
      display: 'flex', flexDirection: 'column', padding: '24px 32px', gap: 20, overflowY: 'auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: t.fontTitle, color: t.gold, fontSize: 26,
            letterSpacing: F ? '0.08em' : '0.22em', textTransform: 'uppercase',
            margin: '0 0 4px', textShadow: `0 0 20px ${t.gold}77` }}>
            {F ? '🏪 La Tienda del Oráculo' : '▣ MERCADO DIGITAL'}
          </h1>
          <p style={{ color: t.textDim, fontSize: 12 }}>
            {F ? 'Adquiere cartas para mejorar tu arsenal de dados'
               : 'ADQUIERE PROTOCOLOS Y MEJORAS DE COMBATE'}
          </p>
        </div>
        <div style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 22,
          textShadow: `0 0 12px ${t.gold}66` }}>
          🪙 {gold}
        </div>
      </div>

      {/* ── Zona principal: NPC + cartas ── */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* NPC Vendedor */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 180 }}>
          <VendorNPC theme={theme}/>
          {/* Bocadillo */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: F ? '8px 8px 8px 2px' : '2px',
            padding: '12px 14px', maxWidth: 180, position: 'relative',
            boxShadow: `0 0 16px ${t.gold}22`,
          }}>
            <div style={{ position: 'absolute', bottom: -8, left: 16,
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${t.border}` }}/>
            <p style={{ color: t.text, fontSize: 12, lineHeight: 1.5,
              fontStyle: F ? 'italic' : 'normal', margin: 0,
              fontFamily: t.fontBody }}>
              "{vendorLine}"
            </p>
            <div style={{ color: t.gold, fontSize: 10, marginTop: 6,
              fontFamily: t.fontTitle, letterSpacing: '0.08em' }}>
              — {F ? 'Zarkon el Mercader' : 'UNIT-7 MERCHANT'}
            </div>
          </div>

          {/* Mazo actual */}
          <div style={{ width: '100%', background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: F ? 5 : 2, padding: '12px 14px' }}>
            <div style={{ color: t.textDim, fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', fontFamily: t.fontTitle, marginBottom: 8 }}>
              {F ? 'Tu Mazo' : 'DECK'} ({deckCards.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {deckCards.map((card, i) => (
                <div key={i} style={{
                  padding: '3px 8px', fontSize: 10, borderRadius: F ? 3 : 1,
                  border: `1px solid ${t.reqColor[card.type]}44`,
                  color: t.reqColor[card.type],
                  fontFamily: t.fontTitle, display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  <span>{card.icon}</span> {card.name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, color: t.textDim, fontSize: 10 }}>
              🎲 {diceCount} dado{diceCount !== 1 ? 's' : ''} por turno
            </div>
          </div>
        </div>

        {/* Cartas en venta + dado extra */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {shopCards.map(card => (
              <ShopCard key={card.id} card={card} price={card.price}
                bought={bought.includes(card.id)}
                canAfford={gold >= card.price}
                onBuy={() => buyCard(card)} theme={theme}/>
            ))}
            <DiceUpgradeItem
              currentDice={diceCount} gold={gold}
              onBuy={buyDice} theme={theme}/>
          </div>
        </div>
      </div>

      {/* ── Botón continuar ── */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <button onClick={() => onDone({ ...gameState, gold, deck, diceCount })} style={{
          padding: '13px 48px', background: t.buttonBg,
          border: `1px solid ${t.buttonBorder}`,
          color: t.btnText, fontFamily: t.fontTitle, fontSize: 14,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          cursor: 'pointer', borderRadius: F ? 3 : 0,
          boxShadow: `0 0 20px ${t.gold}33` }}>
          {F ? 'Continuar →' : 'AVANZAR ▶'}
        </button>
      </div>
    </div>
  );
}

// ── Eventos ───────────────────────────────────────────────────
function EventScreen({ gameState, theme, onDone }) {
  const { EVENTS, CARDS, SHOP_POOL } = window.GameData;
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';

  const [event]    = useStateShop(() => EVENTS[Math.floor(Math.random() * EVENTS.length)]);
  const [result,   setResult]   = useStateShop(null);
  const [newState, setNewState] = useStateShop({ ...gameState });

  const choose = (choice) => {
    if (result) return;
    let s = { ...gameState };
    const e = choice.effect;
    if (e.gold)   s.gold     = (s.gold || 0) + e.gold;
    if (e.damage) s.playerHp = Math.max(1, (s.playerHp || 50) - e.damage);
    if (e.heal)   s.playerHp = Math.min(s.playerMaxHp || 50, (s.playerHp || 50) + e.heal);
    if (e.cost != null && s.gold >= e.cost) {
      s.gold -= e.cost;
      if (e.card) {
        const pick = [...SHOP_POOL].sort(() => Math.random() - 0.5)[0];
        s.deck = [...(s.deck || []), pick];
      }
    }
    setNewState(s);
    setResult(choice.result);
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: t.fontBody,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>

      <div style={{ position: 'fixed', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="evgrid" width={F ? 100 : 40} height={F ? 100 : 40} patternUnits="userSpaceOnUse">
              {F
                ? <circle cx="50" cy="50" r="45" fill="none" stroke={t.gold} strokeWidth="0.6"/>
                : <path d="M 40 0 L 0 0 0 40" fill="none" stroke={t.gold} strokeWidth="0.5"/>}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#evgrid)"/>
        </svg>
      </div>

      <div style={{
        position: 'relative', maxWidth: 520, width: '100%',
        background: t.surface, border: `2px solid ${t.border}`,
        borderRadius: F ? 8 : 2, padding: '44px 40px',
        boxShadow: `0 0 50px ${t.gold}22`, textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 18 }}>{event.icon}</div>
        <h2 style={{ fontFamily: t.fontTitle, color: t.gold, fontSize: 24,
          marginBottom: 16, letterSpacing: '0.06em' }}>{event.title}</h2>
        <p style={{ color: t.text, fontSize: 14, lineHeight: 1.65,
          marginBottom: 32, fontStyle: 'italic' }}>{event.desc}</p>

        {!result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {event.choices.map((ch, i) => (
              <button key={i} onClick={() => choose(ch)} style={{
                padding: '13px 20px',
                background: i === 0 ? t.buttonBg : 'transparent',
                border: `1px solid ${i === 0 ? t.buttonBorder : t.border}`,
                color: i === 0 ? t.btnText : t.text,
                fontFamily: t.fontBody, fontSize: 14, cursor: 'pointer',
                borderRadius: F ? 3 : 0, textAlign: 'left', transition: 'all 0.15s',
              }}>{ch.text}</button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ color: t.gold, fontSize: 15, fontStyle: 'italic',
              padding: '14px 20px', background: `${t.gold}11`,
              border: `1px solid ${t.gold}44`, borderRadius: F ? 4 : 2 }}>
              {result}
            </div>
            <button onClick={() => onDone(newState)} style={{
              padding: '13px 40px', background: t.buttonBg,
              border: `1px solid ${t.buttonBorder}`,
              color: t.btnText, fontFamily: t.fontTitle, fontSize: 13,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: F ? 3 : 0 }}>
              {F ? 'Continuar →' : 'AVANZAR ▶'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.ShopScreen  = ShopScreen;
window.EventScreen = EventScreen;
