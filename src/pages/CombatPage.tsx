/**
 * Pantalla de combate por turnos de Dice Tactics.
 *
 * Flujo de un turno:
 *   1. "roll"      → El jugador lanza todos sus dados.
 *   2. "assign"    → Selecciona un dado y activa cartas compatibles con su valor.
 *   3. "resolving" → Los efectos se resuelven en orden con pausas entre ellos.
 *
 * Orden de resolución en endTurn():
 *   1. Efectos de las cartas activadas (daño, bloque, curación, oro, reflejo, veneno, regen).
 *   2. Veneno existente en el enemigo (−2 HP por turno restante).
 *   3. Comprueba si el enemigo murió → victoria.
 *   4. Regeneración del jugador (+4 HP por turno restante).
 *   5. Ataque del enemigo (con o sin reflejo).
 *   6. Comprueba si el jugador murió → derrota.
 */
import { useState, useRef } from "react";
import { CARDS, checkRequirement } from "../data/cards";
import { ENEMIES } from "../data/enemies";
import { FINAL_BOSS } from "../data/bosses";
import type { ThemeTokens, GameState, Phase } from "../types";
import PlayerPanel from "../components/PlayerPanel";
import EnemyPanel from "../components/EnemyPanel";
import DicePool from "../components/DicePool";
import type { DiceState } from "../components/DicePool";
import CardHand from "../components/CardHand";
import type { HandCard } from "../components/CardHand";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onWin: (updated: GameState) => void;
  onLose: (updated: GameState) => void;
}

// Texto flotante temporal que aparece sobre el jugador o el enemigo al recibir daño / curación
interface Float { id: number; text: string; color: string; isEnemy: boolean }

// Promesa que resuelve después de `ms` milisegundos (usada para pausar entre efectos)
const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export default function CombatPage({ theme: t, gameState, onWin, onLose }: Props) {
  // Piso 3 = jefe final; pisos 0–2 = enemigos normales por orden
  const enemy = gameState.floor < 3 ? ENEMIES[gameState.floor] : FINAL_BOSS;

  // ── Estado del jugador ──────────────────────────────────────────────────────
  const [playerHp,      setPlayerHp]      = useState(gameState.playerHp);
  const [playerBlock,   setPlayerBlock]   = useState(0);
  const [reflect,       setReflect]       = useState(false);
  const [regenTurns,    setRegenTurns]    = useState(0);

  // ── Estado del enemigo ──────────────────────────────────────────────────────
  const [enemyHp,       setEnemyHp]       = useState(enemy.maxHp);
  const [poisonTurns,   setPoisonTurns]   = useState(0);

  // ── Estado del turno ────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("roll");
  const [dice,  setDice]  = useState<DiceState[]>([]);
  const [hand,  setHand]  = useState<HandCard[]>(
    // Inicializa la mano con todas las cartas del mazo, sin activar
    () => gameState.deck.map(id => ({ ...CARDS[id], activated: false, assignedDie: null }))
  );
  const [log,   setLog]   = useState<string[]>([`⚔️ ${enemy.name} aparece! (${enemy.maxHp} HP)`]);
  const [turns, setTurns] = useState(gameState.totalTurns);

  // ── Estado de animaciones ───────────────────────────────────────────────────
  const [enemyHit,      setEnemyHit]      = useState(false);
  const [playerHitAnim, setPlayerHitAnim] = useState(false);
  const [floats,        setFloats]        = useState<Float[]>([]);
  const floatId = useRef(0); // Contador para generar IDs únicos de textos flotantes

  // Añade un mensaje al log (conserva los últimos 30)
  const addLog = (msg: string) => setLog(prev => [...prev.slice(-29), msg]);

  // Muestra un texto flotante durante 1.5 s sobre el jugador o el enemigo
  const addFloat = (text: string, color: string, isEnemy: boolean) => {
    const id = floatId.current++;
    setFloats(prev => [...prev, { id, text, color, isEnemy }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1500);
  };

  // ── Acciones del turno ──────────────────────────────────────────────────────

  // Genera nuevos dados aleatorios y pasa a la fase de asignación
  function rollDice() {
    const newDice: DiceState[] = Array.from({ length: gameState.diceCount }, () => ({
      value: Math.floor(Math.random() * 6) + 1,
      used: false,
      selected: false,
    }));
    setDice(newDice);
    setHand(prev => prev.map(c => ({ ...c, activated: false, assignedDie: null })));
    setPhase("assign");
    addLog(`🎲 Dados: [${newDice.map(d => d.value).join(", ")}]`);
  }

  // Dado e índice actualmente seleccionados por el jugador
  const selectedIdx = dice.findIndex(d => d.selected);
  const selectedVal = selectedIdx >= 0 ? dice[selectedIdx].value : null;

  // Selecciona o deselecciona un dado (solo en fase "assign" y si no fue usado)
  function selectDie(i: number) {
    if (phase !== "assign" || dice[i].used) return;
    setDice(prev => prev.map((d, idx) => ({ ...d, selected: idx === i ? !d.selected : false })));
  }

  // Asigna el dado seleccionado a una carta si cumple el requisito
  function activateCard(ci: number) {
    if (phase !== "assign" || selectedIdx < 0) return;
    const card = hand[ci];
    const die  = dice[selectedIdx];
    if (card.activated || !checkRequirement(card.req, die.value)) return;
    setHand(prev => prev.map((c, i) => i === ci ? { ...c, activated: true, assignedDie: die.value } : c));
    setDice(prev => prev.map((d, i) => i === selectedIdx ? { ...d, used: true, selected: false } : d));
    addLog(`✅ ${card.name} activada con [${die.value}]`);
  }

  // Resuelve todos los efectos del turno de forma asíncrona
  async function endTurn() {
    setPhase("resolving");
    const activated = hand.filter(c => c.activated);

    // Variables locales para acumular cambios — evita múltiples re-renders por setState anidados
    let ehp          = enemyHp;
    let php          = playerHp;
    let blk          = playerBlock;
    let refl         = reflect;
    let existPoison  = poisonTurns;
    let existRegen   = regenTurns;
    let gld          = gameState.gold;
    let pendingPoison = 0;
    let pendingRegen  = 0;

    // ── 1. Efectos de las cartas activadas ────────────────────────────────────
    for (const card of activated) {
      const { effect } = card;

      if (effect.damage) {
        const dmg = effect.damage * (effect.hits ?? 1);
        ehp = Math.max(0, ehp - dmg);
        setEnemyHp(ehp);
        setEnemyHit(true);
        setTimeout(() => setEnemyHit(false), 400);
        addFloat(`−${dmg}`, t.accent, true);
        addLog(`⚔️ ${card.name}: ${dmg} daño al enemigo`);
      }
      if (effect.block) {
        blk += effect.block;
        setPlayerBlock(blk);
        addFloat(`🛡️ +${effect.block === 9999 ? "∞" : effect.block}`, t.accent2, false);
        addLog(`🛡️ ${card.name}: bloqueo activado`);
      }
      if (effect.heal) {
        php = Math.min(gameState.playerMaxHp, php + effect.heal);
        setPlayerHp(php);
        addFloat(`+${effect.heal} HP`, "#44cc66", false);
        addLog(`💚 ${card.name}: +${effect.heal} HP`);
      }
      if (effect.gold) {
        gld += effect.gold;
        addFloat(`+${effect.gold} 🪙`, t.primary, false);
        addLog(`💰 ${card.name}: +${effect.gold} oro`);
      }
      if (effect.reflect) {
        refl = true;
        setReflect(true);
        addLog(`🔄 ${card.name}: reflejo activo`);
      }
      if (effect.dot) {
        ehp = Math.max(0, ehp - effect.dot.dmg);
        setEnemyHp(ehp);
        pendingPoison = effect.dot.turns;
        addFloat(`−${effect.dot.dmg} ☠️`, "#aa44ff", true);
        addLog(`🧪 Veneno aplicado (${effect.dot.turns} turnos)`);
      }
      if (effect.regen) {
        pendingRegen = effect.regen.turns;
        addLog(`🌿 Regeneración activada (${effect.regen.turns} turnos)`);
      }

      if (ehp <= 0) break; // El enemigo ya murió: no procesar más cartas
      await delay(380);    // Pausa para que el jugador vea cada efecto
    }

    // ── 2. Veneno existente ───────────────────────────────────────────────────
    if (existPoison > 0 && ehp > 0) {
      ehp = Math.max(0, ehp - 2);
      setEnemyHp(ehp);
      existPoison--;
      addFloat(`−2 ☠️`, "#aa44ff", true);
      addLog(`☠️ Veneno: 2 daño (${existPoison} turnos restantes)`);
      await delay(300);
    }
    setPoisonTurns(pendingPoison > 0 ? pendingPoison : existPoison);

    // ── 3. Comprobar victoria (cartas + veneno) ───────────────────────────────
    if (ehp <= 0) {
      addLog(`🏆 ¡${enemy.name} derrotado!`);
      onWin({ ...gameState, playerHp: php, gold: gld + enemy.gold, totalTurns: turns + 1 });
      return;
    }

    // ── 4. Regeneración del jugador ───────────────────────────────────────────
    if (existRegen > 0) {
      php = Math.min(gameState.playerMaxHp, php + 4);
      setPlayerHp(php);
      existRegen--;
      addFloat(`+4 🌿`, "#33dd77", false);
      addLog(`🌿 Regeneración: +4 HP (${existRegen} turnos restantes)`);
      await delay(300);
    }
    setRegenTurns(pendingRegen > 0 ? pendingRegen : existRegen);

    // ── 5. Ataque del enemigo ─────────────────────────────────────────────────
    const rawAtk = enemy.attack;
    if (refl) {
      // El reflejo devuelve todo el daño al enemigo
      ehp = Math.max(0, ehp - rawAtk);
      setEnemyHp(ehp);
      setReflect(false);
      addFloat(`↩️ −${rawAtk}`, t.primary, true);
      addLog(`↩️ Reflejo: ${rawAtk} daño devuelto a ${enemy.name}`);
    } else {
      // El bloque absorbe parte del daño antes de que llegue al jugador
      const absorbed  = Math.min(blk, rawAtk);
      const actualDmg = rawAtk - absorbed;
      php = Math.max(0, php - actualDmg);
      setPlayerHp(php);
      if (actualDmg > 0) {
        setPlayerHitAnim(true);
        setTimeout(() => setPlayerHitAnim(false), 400);
        addFloat(`−${actualDmg}`, t.accent, false);
      }
      addLog(absorbed > 0
        ? `⚔️ ${enemy.name}: ${rawAtk} − ${absorbed} bloqueo = ${actualDmg} daño`
        : `⚔️ ${enemy.name}: ${actualDmg} daño`);
    }
    setPlayerBlock(0); // El bloque no persiste entre turnos
    setTurns(prev => prev + 1);

    // ── 6. Comprobar derrota ──────────────────────────────────────────────────
    if (php <= 0) {
      addLog("💀 Has sido derrotado...");
      onLose({ ...gameState, playerHp: 0, totalTurns: turns + 1 });
      return;
    }
    // Segunda comprobación: el reflejo pudo haber matado al enemigo en el paso 5
    if (ehp <= 0) {
      addLog(`🏆 ¡${enemy.name} derrotado!`);
      onWin({ ...gameState, playerHp: php, gold: gld + enemy.gold, totalTurns: turns + 1 });
      return;
    }

    setPhase("roll");
  }

  // Cuadrados de progreso de piso en el header (rellenos hasta el piso actual)
  const floorBoxes = Array.from({ length: 4 }, (_, i) => (
    <div key={i} style={{
      width: 18, height: 18,
      background: i <= gameState.floor ? t.primary : t.surface2,
      border: `1px solid ${t.border}`,
      borderRadius: 3,
    }} />
  ));

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: t.bg,
      display: "flex", flexDirection: "column",
      fontFamily: t.bodyFont, color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      {/* Textos flotantes de daño y curación sobre los paneles */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: "absolute",
          top: "35%",
          left: f.isEnemy ? "62%" : "28%",
          color: f.color,
          fontFamily: t.titleFont, fontSize: 20, fontWeight: "bold",
          pointerEvents: "none",
          animation: "floatUp 1.4s ease-out forwards",
          zIndex: 9000,
          textShadow: `0 0 8px ${f.color}`,
        }}>
          {f.text}
        </div>
      ))}

      {/* ── Header: nivel, nombre del enemigo e indicadores de piso ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px",
        background: t.surface1, borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 15 }}>
          {`NIVEL ${gameState.floor + 1}/4`}
          {" — "}
          <span style={{ color: t.text }}>{enemy.name}</span>
          {enemy.isBoss && (
            <span style={{ color: t.accent, marginLeft: 8, fontSize: 13 }}>⚠ JEFE</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 5 }}>{floorBoxes}</div>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 15 }}>
          🪙 {gameState.gold}
        </div>
      </div>

      {/* ── Área de batalla: jugador | log de eventos | enemigo ── */}
      <div style={{ display: "flex", flex: 1, gap: 12, padding: "16px 24px", minHeight: 0, overflow: "hidden" }}>
        {/* Panel izquierdo del jugador */}
        <PlayerPanel
          playerHp={playerHp}
          playerMaxHp={gameState.playerMaxHp}
          playerBlock={playerBlock}
          reflect={reflect}
          regenTurns={regenTurns}
          isHit={playerHitAnim}
          theme={t}
        />

        {/* Log de eventos: el mensaje más reciente aparece más brillante */}
        <div style={{
          flex: 1,
          background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
          padding: "12px 16px",
          overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {log.map((msg, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: i === log.length - 1 ? t.text : t.textDim,
              fontFamily: t.bodyFont, lineHeight: 1.5,
            }}>
              {msg}
            </div>
          ))}
        </div>

        {/* Panel derecho del enemigo */}
        <EnemyPanel
          enemyHp={enemyHp}
          enemy={enemy}
          poisonTurns={poisonTurns}
          isHit={enemyHit}
          theme={t}
        />
      </div>

      {/* ── Sección de dados: lanzar, seleccionar y terminar turno ── */}
      <DicePool
        dice={dice}
        phase={phase}
        selectedVal={selectedVal}
        activatedCount={hand.filter(c => c.activated).length}
        onSelectDie={selectDie}
        onRoll={rollDice}
        onEndTurn={endTurn}
        theme={t}
      />

      {/* ── Mano de cartas del jugador ── */}
      <CardHand
        hand={hand}
        selectedVal={selectedVal}
        phase={phase}
        onActivateCard={activateCard}
        theme={t}
      />
    </div>
  );
}
