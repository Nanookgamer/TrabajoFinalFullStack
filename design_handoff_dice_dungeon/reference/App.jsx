// ============================================================
//  DICE DUNGEON — App principal, Login, Menú, Transición, Win/Lose
// ============================================================
const { useState, useEffect } = React;

const CombatScreen = window.CombatScreen;
const ShopScreen = window.ShopScreen;
const EventScreen = window.EventScreen;

// ── LOGIN ────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusUser, setFocusUser] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const submit = () => {
    if (!user.trim()) {setErr('Ingresa tu nombre de aventurero');return;}
    if (pass.length < 3) {setErr('Contraseña demasiado corta (mín. 3 caracteres)');return;}
    setLoading(true);
    setTimeout(() => {setLoading(false);onLogin(user.trim());}, 1100);
  };

  const inputStyle = (focused) => ({
    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
    background: t.surface2, border: `1px solid ${focused ? t.gold : t.border}`,
    color: t.text, fontFamily: t.fontBody, fontSize: 15,
    outline: 'none', borderRadius: F ? 3 : 0,
    transition: 'border-color 0.2s',
    letterSpacing: '0.02em'
  });

  const LogoDice = () =>
  <svg viewBox="0 0 64 64" width="58" height="58" style={{ width: "58px", height: "58px" }}>
      {F ? <>
        <rect x="2" y="2" width="26" height="26" rx="4" fill={t.gold} opacity="0.9" />
        <circle cx="8" cy="8" r="3" fill={t.bg} />
        <circle cx="18" cy="15" r="3" fill={t.bg} />
        <circle cx="8" cy="22" r="3" fill={t.bg} />
        <rect x="36" y="2" width="26" height="26" rx="4" fill={t.accent} opacity="0.9" />
        <circle cx="49" cy="15" r="3" fill={t.bg} />
        <rect x="2" y="36" width="26" height="26" rx="4" fill={t.accent} opacity="0.9" />
        <circle cx="15" cy="49" r="3" fill={t.bg} />
        <rect x="36" y="36" width="26" height="26" rx="4" fill={t.gold} opacity="0.9" />
        <circle cx="42" cy="42" r="3" fill={t.bg} />
        <circle cx="58" cy="42" r="3" fill={t.bg} />
        <circle cx="42" cy="58" r="3" fill={t.bg} />
        <circle cx="58" cy="58" r="3" fill={t.bg} />
      </> : <>
        <polygon points="16,2 30,2 30,16 16,16" fill="none" stroke={t.gold} strokeWidth="1.5" />
        <circle cx="23" cy="9" r="3" fill={t.gold} />
        <polygon points="34,2 62,2 62,30 34,30" fill="none" stroke={t.accent} strokeWidth="1.5" />
        <circle cx="40" cy="8" r="2" fill={t.accent} />
        <circle cx="56" cy="24" r="2" fill={t.accent} />
        <polygon points="2,34 16,34 16,62 2,62" fill="none" stroke={t.accent} strokeWidth="1.5" />
        <circle cx="9" cy="40" r="2" fill={t.accent} />
        <circle cx="9" cy="56" r="2" fill={t.accent} />
        <polygon points="20,34 62,34 62,62 20,62" fill="none" stroke={t.gold} strokeWidth="1.5" />
        <circle cx="27" cy="41" r="2" fill={t.gold} />
        <circle cx="41" cy="48" r="2" fill={t.gold} />
        <circle cx="55" cy="55" r="2" fill={t.gold} />
      </>}
    </svg>;


  // Matrix rain
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = F
      ? '0123456789ABCDEF⚔♦♠♣♥✦∞ΩΔⅠⅡⅢⅣⅤ'
      : '01アイウエカキクサシスタチツナニヌ#$%&ABCDEF><';
    const fs = 14;
    let drops = [];
    const initDrops = () => { drops = Array(Math.floor(canvas.width / fs)).fill(0).map(() => Math.random() * -40); };
    initDrops();
    const draw = () => {
      ctx.fillStyle = `${t.bg}22`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fs}px monospace`;
      const cols = Math.floor(canvas.width / fs);
      if (drops.length !== cols) initDrops();
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.94 ? '#ffffffcc' : (F ? `${t.gold}88` : `${t.gold}66`);
        ctx.fillText(ch, i * fs, drops[i] * fs);
        if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const iv = setInterval(draw, 55);
    return () => { clearInterval(iv); window.removeEventListener('resize', resize); };
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: t.bg, fontFamily: t.fontBody,
      position: 'relative', overflow: 'hidden' }}>

      {/* Matrix rain canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none' }}/>

      <div style={{
        position: 'relative', width: 420, padding: '48px 44px',
        background: t.surface, border: `2px solid ${t.border}`,
        boxShadow: `0 0 60px ${t.gold}22, 0 0 120px ${t.gold}0a`,
        ...(F ?
        { borderRadius: 5 } :
        { clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))' })
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
            <LogoDice />
          </div>
          <h1 style={{ fontFamily: t.fontTitle, color: t.gold, fontSize: 26,
            margin: '0 0 5px', fontWeight: 700,
            letterSpacing: F ? '0.1em' : '0.28em', textTransform: 'uppercase',
            textShadow: `0 0 24px ${t.gold}77` }}>
            Dice Dungeon
          </h1>
          <p style={{ color: t.textDim, fontSize: 12, letterSpacing: '0.06em',
            fontFamily: t.fontBody }}>
            {F ? 'La Mazmorra de los Dados Malditos' : 'SECTOR-7 // DUNGEON PROTOCOL v2.4'}
          </p>
        </div>

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: t.textDim, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
              fontFamily: t.fontTitle }}>
              {F ? 'Nombre del Aventurero' : 'ID DE USUARIO'}
            </label>
            <input value={user} onChange={(e) => {setUser(e.target.value);setErr('');}}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            onFocus={() => setFocusUser(true)} onBlur={() => setFocusUser(false)}
            placeholder={F ? 'Ingresa tu nombre...' : 'operador@sector7'}
            style={inputStyle(focusUser)} />
          </div>
          <div>
            <label style={{ display: 'block', color: t.textDim, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
              fontFamily: t.fontTitle }}>
              {F ? 'Contraseña Rúnica' : 'CÓDIGO DE ACCESO'}
            </label>
            <input type="password" value={pass}
            onChange={(e) => {setPass(e.target.value);setErr('');}}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)}
            placeholder="••••••••" style={inputStyle(focusPass)} />
          </div>

          {err && <p style={{ color: t.accent, fontSize: 12, textAlign: 'center', margin: 0 }}>{err}</p>}

          <button onClick={submit} disabled={loading} style={{
            marginTop: 8, padding: '14px',
            background: loading ? t.surface2 : t.buttonBg,
            border: `1px solid ${loading ? t.border : t.buttonBorder}`,
            color: loading ? t.textDim : t.btnText,
            fontFamily: t.fontTitle, fontSize: 13,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: loading ? 'default' : 'pointer',
            borderRadius: F ? 3 : 0, transition: 'all 0.2s'
          }}>
            {loading ?
            F ? 'Invocando...' : 'AUTENTICANDO...' :
            F ? 'Entrar a la Mazmorra' : 'INICIAR SESIÓN'}
          </button>

          {/* Link a registro */}
          <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: t.textDim, fontFamily: t.fontBody }}>
            {F ? '¿No tienes cuenta? ' : '¿Sin cuenta? '}
            <span onClick={onRegister} style={{
              color: t.gold, cursor: 'pointer', textDecoration: 'underline',
              textUnderlineOffset: 3, transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              {F ? 'Créate una aquí' : 'REGÍSTRATE AQUÍ'}
            </span>
          </p>
        </div>
      </div>
    </div>);

}

// ── REGISTRO ─────────────────────────────────────────────────
function RegisterScreen({ onRegistered, onBack, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const [user,    setUser]    = useState('');
  const [pass,    setPass]    = useState('');
  const [pass2,   setPass2]   = useState('');
  const [err,     setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const [focusU,  setFocusU]  = useState(false);
  const [focusP,  setFocusP]  = useState(false);
  const [focusP2, setFocusP2] = useState(false);

  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = F ? '0123456789ABCDEF⚔♦♠♣♥✦∞ΩΔⅠⅡⅢⅣⅤ' : '01アイウエカキクサシスタチツナニヌ#$%&ABCDEF><';
    const fs = 14;
    let drops = Array(Math.floor(canvas.width / fs)).fill(0).map(() => Math.random() * -40);
    const draw = () => {
      ctx.fillStyle = `${t.bg}22`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fs}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.94 ? '#ffffffcc' : (F ? `${t.gold}88` : `${t.gold}66`);
        ctx.fillText(ch, i * fs, drops[i] * fs);
        if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const iv = setInterval(draw, 55);
    return () => { clearInterval(iv); window.removeEventListener('resize', resize); };
  }, [theme]);

  const inputStyle = (focused) => ({
    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
    background: t.surface2, border: `1px solid ${focused ? t.gold : t.border}`,
    color: t.text, fontFamily: t.fontBody, fontSize: 15,
    outline: 'none', borderRadius: F ? 3 : 0, transition: 'border-color 0.2s',
  });

  const submit = () => {
    if (!user.trim())        { setErr('Ingresa un nombre de usuario'); return; }
    if (user.trim().length < 3) { setErr('El nombre debe tener al menos 3 caracteres'); return; }
    if (pass.length < 3)     { setErr('La contraseña debe tener al menos 3 caracteres'); return; }
    if (pass !== pass2)      { setErr('Las contraseñas no coinciden'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onRegistered(user.trim()); }, 1100);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: t.bg, fontFamily: t.fontBody,
      position: 'relative', overflow: 'hidden' }}>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none' }}/>

      <div style={{
        position: 'relative', width: 420, padding: '44px 44px',
        background: t.surface, border: `2px solid ${t.border}`,
        boxShadow: `0 0 60px ${t.gold}22`,
        ...(F ? { borderRadius: 5 } : { clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))' }),
      }}>
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: t.fontTitle, color: t.gold, fontSize: 22,
            margin: '0 0 6px', fontWeight: 700,
            letterSpacing: F ? '0.1em' : '0.22em', textTransform: 'uppercase',
            textShadow: `0 0 20px ${t.gold}77` }}>
            {F ? 'Crear Cuenta' : 'NUEVO OPERADOR'}
          </h1>
          <p style={{ color: t.textDim, fontSize: 12, fontFamily: t.fontBody }}>
            {F ? 'Registra tu nombre en los anales de la mazmorra'
               : 'REGISTRA TUS CREDENCIALES EN EL SISTEMA'}
          </p>
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', color: t.textDim, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
              fontFamily: t.fontTitle }}>
              {F ? 'Nombre de Aventurero' : 'ID DE USUARIO'}
            </label>
            <input value={user} onChange={e => { setUser(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              onFocus={() => setFocusU(true)} onBlur={() => setFocusU(false)}
              placeholder={F ? 'Elige tu nombre...' : 'nuevo_operador'}
              style={inputStyle(focusU)}/>
          </div>
          <div>
            <label style={{ display: 'block', color: t.textDim, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
              fontFamily: t.fontTitle }}>
              {F ? 'Contraseña Rúnica' : 'CONTRASEÑA'}
            </label>
            <input type="password" value={pass}
              onChange={e => { setPass(e.target.value); setErr(''); }}
              onFocus={() => setFocusP(true)} onBlur={() => setFocusP(false)}
              placeholder="••••••••" style={inputStyle(focusP)}/>
          </div>
          <div>
            <label style={{ display: 'block', color: t.textDim, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
              fontFamily: t.fontTitle }}>
              {F ? 'Confirmar Contraseña' : 'CONFIRMAR CONTRASEÑA'}
            </label>
            <input type="password" value={pass2}
              onChange={e => { setPass2(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              onFocus={() => setFocusP2(true)} onBlur={() => setFocusP2(false)}
              placeholder="••••••••" style={inputStyle(focusP2)}/>
          </div>

          {err && <p style={{ color: t.accent, fontSize: 12, textAlign: 'center', margin: 0 }}>{err}</p>}

          <button onClick={submit} disabled={loading} style={{
            marginTop: 6, padding: '14px',
            background: loading ? t.surface2 : t.buttonBg,
            border: `1px solid ${loading ? t.border : t.buttonBorder}`,
            color: loading ? t.textDim : t.btnText,
            fontFamily: t.fontTitle, fontSize: 13,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: loading ? 'default' : 'pointer',
            borderRadius: F ? 3 : 0, transition: 'all 0.2s',
          }}>
            {loading
              ? (F ? 'Registrando...' : 'PROCESANDO...')
              : (F ? 'Crear Cuenta' : 'REGISTRARSE')}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: t.textDim, fontFamily: t.fontBody, marginTop: 4 }}>
            {F ? '¿Ya tienes cuenta? ' : '¿Ya registrado? '}
            <span onClick={onBack} style={{
              color: t.gold, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              {F ? 'Inicia sesión aquí' : 'INICIA SESIÓN'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── MENÚ ─────────────────────────────────────────────────────
function MenuScreen({ username, hasSave, onNewGame, onContinue, onLogout, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const [hovered, setHovered] = useState(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    if (F) {
      // Fantasía: símbolos y dados flotando hacia arriba
      const symbols = ['⚔','🎲','♦','♠','⚡','✦','∞','Ω','1','2','3','4','5','6'];
      const particles = Array(40).fill(0).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 10 + Math.random() * 22,
        speed: 0.3 + Math.random() * 0.7,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        sym: symbols[Math.floor(Math.random() * symbols.length)],
        opacity: 0.06 + Math.random() * 0.18,
        color: Math.random() > 0.6 ? t.accent : t.gold,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = p.color;
          ctx.fillText(p.sym, 0, 0);
          ctx.restore();
          p.y -= p.speed;
          p.rot += p.rotSpeed;
          if (p.y < -40) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        });
      };
      const iv = setInterval(draw, 40);
      return () => { clearInterval(iv); window.removeEventListener('resize', resize); };
    } else {
      // Sci-Fi: lluvia de datos + línea de escaneo
      const chars = '01アイウエカキサシスタチ#$%ABCDEF><';
      const fs = 13;
      let drops = Array(Math.floor(canvas.width / fs)).fill(0).map(() => Math.random() * -60);
      let scanY = 0;
      const draw = () => {
        ctx.fillStyle = `${t.bg}18`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fs}px monospace`;
        const cols = Math.floor(canvas.width / fs);
        for (let i = 0; i < Math.min(cols, drops.length); i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = Math.random() > 0.95 ? '#ffffffbb' : `${t.gold}55`;
          ctx.fillText(ch, i * fs, drops[i] * fs);
          if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `${t.gold}14`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 50, canvas.width, 100);
        scanY = (scanY + 1.5) % canvas.height;
      };
      const iv = setInterval(draw, 45);
      return () => { clearInterval(iv); window.removeEventListener('resize', resize); };
    }
  }, [theme]);

  const items = [
  { key: 'new', label: F ? 'Nueva Partida' : 'NUEVA PARTIDA', action: onNewGame, primary: true },
  { key: 'continue', label: F ? 'Continuar' : 'CONTINUAR', action: onContinue, disabled: !hasSave },
  { key: 'logout', label: F ? 'Cerrar Sesión' : 'CERRAR SESIÓN', action: onLogout },
  { key: 'exit', label: F ? 'Salir' : 'SALIR', action: () => window.close() }];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: t.bg, fontFamily: t.fontBody,
      position: 'relative', overflow: 'hidden' }}>

      {/* Canvas animado */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>

      <div style={{ position: 'relative', textAlign: 'center', width: 360 }}>
        {/* Título */}
        <h1 style={{ fontFamily: t.fontTitle, color: t.gold, fontSize: 46,
          margin: '0 0 6px', fontWeight: 700,
          letterSpacing: F ? '0.08em' : '0.22em', textTransform: 'uppercase',
          textShadow: `0 0 32px ${t.gold}99` }}>
          Dice Dungeon
        </h1>
        <p style={{ color: t.textDim, marginBottom: 56, fontSize: 13, fontFamily: t.fontBody,
          letterSpacing: '0.04em' }}>
          {F ? `Bienvenido de nuevo, ${username}` : `USUARIO: ${username.toUpperCase()}`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) =>
          <button key={item.key}
          onClick={!item.disabled ? item.action : undefined}
          onMouseEnter={() => !item.disabled && setHovered(item.key)}
          onMouseLeave={() => setHovered(null)}
          disabled={item.disabled}
          style={{
            padding: '16px 36px',
            background: item.primary ?
            hovered === item.key ? t.buttonBg : t.buttonBg :
            hovered === item.key ? `${t.gold}11` : 'transparent',
            border: `1px solid ${item.disabled ? t.border :
            item.primary ? t.buttonBorder :
            hovered === item.key ? `${t.gold}88` : t.border}`,
            color: item.disabled ? t.textDim :
            item.primary ? t.btnText :
            t.text,
            fontFamily: t.fontTitle, fontSize: 15, letterSpacing: '0.14em',
            textTransform: 'uppercase', cursor: item.disabled ? 'default' : 'pointer',
            borderRadius: F ? 3 : 0, transition: 'all 0.18s',
            opacity: item.disabled ? 0.35 : 1,
            boxShadow: item.primary && hovered === item.key ? `0 0 20px ${t.gold}44` : 'none'
          }}>
              {item.label}
            </button>
          )}
        </div>
      </div>
    </div>);

}

// ── TRANSICIÓN ────────────────────────────────────────────────
function TransitionScreen({ message, theme, onDone }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let v = 0;
    const iv = setInterval(() => {
      v += 1.8;
      setPct(Math.min(v, 100));
      if (v >= 100) {clearInterval(iv);setTimeout(onDone, 280);}
    }, 22);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: t.bg, fontFamily: t.fontBody, gap: 28 }}>
      <p style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 20,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        textShadow: `0 0 18px ${t.gold}88`, animation: 'pulse 1s infinite' }}>
        {message}
      </p>
      <div style={{ width: 300, height: 5, background: t.surface2,
        borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: t.gold,
          transition: 'width 0.025s linear',
          boxShadow: `0 0 10px ${t.gold}` }} />
      </div>
      {!F &&
      <div style={{ color: t.textDim, fontSize: 11, letterSpacing: '0.1em', fontFamily: t.fontTitle }}>
          {Math.round(pct)}%
        </div>
      }
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>);

}

// ── WIN / LOSE ────────────────────────────────────────────────
function WinLoseScreen({ won, playerHp, gold, turns, onRestart, onMenu, theme }) {
  const t = window.THEMES[theme];
  const F = theme === 'fantasy';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: t.bg, fontFamily: t.fontBody, gap: 28, position: 'relative',
      overflow: 'hidden' }}>

      {/* Partículas decorativas */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="wlbg" width="80" height="80" patternUnits="userSpaceOnUse">
              {won ?
              <circle cx="40" cy="40" r="36" fill="none" stroke={t.gold} strokeWidth="0.8" /> :
              <path d="M 80 0 L 0 80" stroke={t.accent} strokeWidth="0.5" fill="none" />}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wlbg)" />
        </svg>
      </div>

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 88, marginBottom: 18, filter: `drop-shadow(0 0 20px ${won ? t.gold : t.accent})` }}>
          {won ? '🏆' : '💀'}
        </div>
        <h1 style={{
          fontFamily: t.fontTitle, fontSize: 52, margin: '0 0 12px',
          color: won ? t.gold : t.accent,
          letterSpacing: F ? '0.08em' : '0.22em', textTransform: 'uppercase',
          textShadow: `0 0 36px ${won ? t.gold : t.accent}aa`
        }}>
          {won ? '¡Victoria!' : 'Derrota'}
        </h1>
        <p style={{ color: t.textDim, fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
          {won ?
          F ? 'Has conquistado la mazmorra de los dados malditos. Las sombras se inclinan ante ti.' :
          'PROTOCOLO DUNGEON COMPLETADO. TODAS LAS AMENAZAS NEUTRALIZADAS.' :
          F ? 'Las tinieblas te han consumido... La mazmorra reclama otra alma.' :
          'CONEXIÓN TERMINADA. DATOS DEL OPERADOR PERDIDOS.'}
        </p>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'flex', gap: 28, padding: '18px 32px',
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: F ? 5 : 2 }}>
        {[
        { label: F ? 'HP Restante' : 'HP FINAL', value: Math.max(0, playerHp), color: t.hp },
        { label: F ? 'Oro Acumulado' : 'GOLD TOTAL', value: `🪙 ${gold}`, color: t.gold },
        { label: F ? 'Turnos Jugados' : 'TURNOS', value: turns, color: t.text }].
        map((s) =>
        <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ color: s.color, fontFamily: t.fontTitle, fontSize: 22, fontWeight: 700 }}>
              {s.value}
            </div>
            <div style={{ color: t.textDim, fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onRestart} style={{
          padding: '14px 34px', background: t.buttonBg,
          border: `1px solid ${t.buttonBorder}`,
          color: t.btnText, fontFamily: t.fontTitle, fontSize: 13,
          letterSpacing: '0.13em', textTransform: 'uppercase',
          cursor: 'pointer', borderRadius: F ? 3 : 0 }}>
          {F ? 'Jugar de Nuevo' : 'REINICIAR'}
        </button>
        <button onClick={onMenu} style={{
          padding: '14px 34px', background: 'transparent',
          border: `1px solid ${t.border}`,
          color: t.text, fontFamily: t.fontTitle, fontSize: 13,
          letterSpacing: '0.13em', textTransform: 'uppercase',
          cursor: 'pointer', borderRadius: F ? 3 : 0 }}>
          {F ? 'Menú Principal' : 'MENÚ'}
        </button>
      </div>
    </div>);

}

// ── APP PRINCIPAL ─────────────────────────────────────────────
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "theme": "fantasy", "startingHp": 50, "diceCount": 3 } /*EDITMODE-END*/;
  const [tweaks, setTweaks] = useState(() => {
    try {return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem('dd_tweaks') || '{}') };}
    catch {return TWEAK_DEFAULTS;}
  });
  const theme = tweaks.theme;

  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [transMsg, setTransMsg] = useState('');
  const [transNext, setTransNext] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // Cargar sesión guardada
  useEffect(() => {
    const u = localStorage.getItem('dd_user');
    if (u) {setUsername(u);setScreen('menu');}
    const gs = localStorage.getItem('dd_state');
    if (gs) {try {setGameState(JSON.parse(gs));} catch {}}

    // Tweaks host messages
    window.addEventListener('message', (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }, []);

  const save = (gs) => localStorage.setItem('dd_state', JSON.stringify(gs));

  const goTo = (next, msg) => {
    if (msg) {setTransMsg(msg);setTransNext(next);setScreen('transition');} else
    setScreen(next);
  };

  const startNew = () => {
    const { STARTER_DECK, CARDS } = window.GameData;
    const gs = {
      playerHp: tweaks.startingHp, playerMaxHp: tweaks.startingHp,
      gold: 10, deck: [...STARTER_DECK], floor: 0, totalTurns: 0
    };
    setGameState(gs);save(gs);
    goTo('combat', F ? 'Entrando a la Mazmorra...' : 'INICIANDO PROTOCOLO...');
  };

  const handleLogin = (u) => {
    setUsername(u);localStorage.setItem('dd_user', u);setScreen('menu');
  };
  const handleLogout = () => {
    setUsername('');localStorage.removeItem('dd_user');setScreen('login');
  };

  const handleCombatEnd = (won, updState) => {
    const gs = { ...updState };
    setGameState(gs);save(gs);
    if (!won) {
      setGameState((s) => ({ ...s, _won: false }));
      goTo('winlose', F ? 'Cayendo en las sombras...' : 'CONEXIÓN PERDIDA...');
    } else {
      const next = gs.floor + 1;
      if (next >= 4) {
        setGameState((s) => ({ ...s, _won: true }));
        goTo('winlose', F ? '¡Victoria inminente!' : 'PROTOCOLO COMPLETADO');
      } else {
        const updated = { ...gs, floor: next };
        setGameState(updated);save(updated);
        const mid = next % 2 === 1 ? 'shop' : 'event';
        goTo(mid, mid === 'shop' ?
        F ? 'Llegando a la Tienda...' : 'ACCEDIENDO AL MERCADO...' :
        F ? 'Explorando el camino...' : 'EVENTO DETECTADO...');
      }
    }
  };

  const handleShopDone = (gs) => {setGameState(gs);save(gs);goTo('combat', F ? 'Siguiente nivel...' : 'AVANZANDO...');};
  const handleEventDone = (gs) => {setGameState(gs);save(gs);goTo('combat', F ? 'Continuando...' : 'REANUDANDO...');};

  const t = window.THEMES[theme];
  const F = theme === 'fantasy';
  const hasSave = !!localStorage.getItem('dd_state');

  const updateTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    localStorage.setItem('dd_tweaks', JSON.stringify(next));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onRegister={() => setScreen('register')} theme={theme} />;
      case 'register':
        return <RegisterScreen onRegistered={handleLogin} onBack={() => setScreen('login')} theme={theme} />;
      case 'menu':
        return <MenuScreen username={username} hasSave={hasSave}
        onNewGame={startNew}
        onContinue={() => {
          if (gameState) goTo('combat', F ? 'Continuando tu aventura...' : 'RECONECTANDO...');
        }}
        onLogout={handleLogout} theme={theme} />;
      case 'transition':
        return <TransitionScreen message={transMsg} theme={theme}
        onDone={() => setScreen(transNext)} />;
      case 'combat':
        return gameState ?
        <CombatScreen gameState={gameState} theme={theme} tweaks={tweaks} onEnd={handleCombatEnd} /> :
        <div style={{ color: t.text, padding: 40 }}>Cargando...</div>;
      case 'shop':
        return gameState ?
        <ShopScreen gameState={gameState} theme={theme} onDone={handleShopDone} /> :
        null;
      case 'event':
        return gameState ?
        <EventScreen gameState={gameState} theme={theme} onDone={handleEventDone} /> :
        null;
      case 'winlose':
        return gameState ?
        <WinLoseScreen won={!!gameState._won} playerHp={gameState.playerHp}
        gold={gameState.gold} turns={gameState.totalTurns || 0}
        onRestart={startNew} onMenu={() => setScreen('menu')} theme={theme} /> :
        null;
      default:return null;
    }
  };

  return (
    <>
      {renderScreen()}

      {/* ── Panel Tweaks ── */}
      {tweaksOpen &&
      <div style={{
        position: 'fixed', bottom: 24, right: 24, width: 260,
        background: t.surface, border: `1px solid ${t.border}`,
        padding: '20px 22px', zIndex: 9999, fontFamily: t.fontBody,
        boxShadow: `0 0 30px ${t.gold}33`,
        borderRadius: F ? 5 : 0
      }}>
          <h3 style={{ color: t.gold, fontFamily: t.fontTitle, fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 18px' }}>
            Tweaks
          </h3>

          {/* Tema */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: t.textDim, fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', display: 'block', marginBottom: 8,
            fontFamily: t.fontTitle }}>
              Estilo Visual
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['fantasy', 'scifi'].map((th) =>
            <button key={th} onClick={() => updateTweak('theme', th)} style={{
              flex: 1, padding: '8px 4px',
              background: theme === th ? t.buttonBg : 'transparent',
              border: `1px solid ${theme === th ? t.buttonBorder : t.border}`,
              color: theme === th ? t.btnText : t.textDim,
              fontFamily: t.fontTitle, fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              borderRadius: F ? 2 : 0
            }}>
                  {th === 'fantasy' ? '⚔️ Fantasía' : '🚀 Sci-Fi'}
                </button>
            )}
            </div>
          </div>

          {/* HP inicial */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: t.textDim, fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: t.fontTitle }}>
              HP Inicial: <span style={{ color: t.text }}>{tweaks.startingHp}</span>
            </label>
            <input type="range" min="30" max="100" step="5" value={tweaks.startingHp}
          onChange={(e) => updateTweak('startingHp', +e.target.value)}
          style={{ width: '100%', accentColor: t.gold }} />
          </div>

          {/* Dados */}
          <div>
            <label style={{ color: t.textDim, fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: t.fontTitle }}>
              Dados por Turno: <span style={{ color: t.text }}>{tweaks.diceCount}</span>
            </label>
            <input type="range" min="2" max="5" step="1" value={tweaks.diceCount}
          onChange={(e) => updateTweak('diceCount', +e.target.value)}
          style={{ width: '100%', accentColor: t.gold }} />
          </div>
        </div>
      }
    </>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);