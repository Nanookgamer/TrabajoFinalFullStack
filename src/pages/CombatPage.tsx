import { useState, useRef } from "react";
import { CARDS, checkRequirement } from "../data/cards";
import { ENEMIES } from "../data/enemies";
import { FINAL_BOSS } from "../data/bosses";
import type { Card, ThemeTokens, GameState } from "../types";

interface Props {
  theme: ThemeTokens;
  gameState: GameState;
  onWin: (updated: GameState) => void;
  onLose: (updated: GameState) => void;
}

type Phase = "roll" | "assign" | "resolving";

interface DiceState { value: number; used: boolean; selected: boolean }
interface HandCard extends Card { activated: boolean; assignedDie: number | null }
interface Float { id: number; text: string; color: string; isEnemy: boolean }

const DOT_POS: Record<number, [number, number][]> = {
  1: [[24, 24]],
  2: [[16, 16], [32, 32]],
  3: [[16, 16], [24, 24], [32, 32]],
  4: [[16, 16], [32, 16], [16, 32], [32, 32]],
  5: [[16, 16], [32, 16], [24, 24], [16, 32], [32, 32]],
  6: [[16, 12], [32, 12], [16, 24], [32, 24], [16, 36], [32, 36]],
};

function hpBarColor(pct: number, accent: string) {
  if (pct > 0.6) return "#44cc66";
  if (pct > 0.3) return "#ffcc00";
  return accent;
}

function reqLabel(req: Card["req"]): string {
  switch (req.type) {
    case "even":  return "PAR";
    case "odd":   return "IMPAR";
    case "exact": return `= ${req.value}`;
    case "range": return `${req.min} – ${req.max}`;
  }
}

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export default function CombatPage({ theme: t, gameState, onWin, onLose }: Props) {
  const enemy = gameState.floor < 3 ? ENEMIES[gameState.floor] : FINAL_BOSS;

  const [playerHp, setPlayerHp] = useState(gameState.playerHp);
  const [playerBlock, setPlayerBlock] = useState(0);
  const [reflect, setReflect] = useState(false);
  const [regenTurns, setRegenTurns] = useState(0);

  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [poisonTurns, setPoisonTurns] = useState(0);

  const [phase, setPhase] = useState<Phase>("roll");
  const [dice, setDice] = useState<DiceState[]>([]);
  const [hand, setHand] = useState<HandCard[]>(
    () => gameState.deck.map(id => ({ ...CARDS[id], activated: false, assignedDie: null }))
  );
  const [log, setLog] = useState<string[]>([`⚔️ ${enemy.name} aparece! (${enemy.maxHp} HP)`]);
  const [turns, setTurns] = useState(gameState.totalTurns);
  const [enemyHit, setEnemyHit] = useState(false);
  const [playerHitAnim, setPlayerHitAnim] = useState(false);
  const [floats, setFloats] = useState<Float[]>([]);
  const floatId = useRef(0);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-29), msg]);

  const addFloat = (text: string, color: string, isEnemy: boolean) => {
    const id = floatId.current++;
    setFloats(prev => [...prev, { id, text, color, isEnemy }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1500);
  };

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

  const selectedIdx = dice.findIndex(d => d.selected);
  const selectedVal = selectedIdx >= 0 ? dice[selectedIdx].value : null;

  function selectDie(i: number) {
    if (phase !== "assign" || dice[i].used) return;
    setDice(prev => prev.map((d, idx) => ({ ...d, selected: idx === i ? !d.selected : false })));
  }

  function activateCard(ci: number) {
    if (phase !== "assign" || selectedIdx < 0) return;
    const card = hand[ci];
    const die = dice[selectedIdx];
    if (card.activated || !checkRequirement(card.req, die.value)) return;
    setHand(prev => prev.map((c, i) => i === ci ? { ...c, activated: true, assignedDie: die.value } : c));
    setDice(prev => prev.map((d, i) => i === selectedIdx ? { ...d, used: true, selected: false } : d));
    addLog(`✅ ${card.name} activada con [${die.value}]`);
  }

  async function endTurn() {
    setPhase("resolving");
    const activated = hand.filter(c => c.activated);

    let ehp = enemyHp;
    let php = playerHp;
    let blk = playerBlock;
    let refl = reflect;
    let existPoison = poisonTurns;
    let existRegen = regenTurns;
    let gld = gameState.gold;
    let pendingPoison = 0;
    let pendingRegen = 0;

    // ── Resolver cartas ──────────────────────────────────────────────────────
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

      if (ehp <= 0) break;
      await delay(380);
    }

    // ── Veneno existente ─────────────────────────────────────────────────────
    if (existPoison > 0 && ehp > 0) {
      ehp = Math.max(0, ehp - 2);
      setEnemyHp(ehp);
      existPoison--;
      addFloat(`−2 ☠️`, "#aa44ff", true);
      addLog(`☠️ Veneno: 2 daño (${existPoison} turnos restantes)`);
      await delay(300);
    }
    setPoisonTurns(pendingPoison > 0 ? pendingPoison : existPoison);

    // ── Victoria (cartas + veneno) ───────────────────────────────────────────
    if (ehp <= 0) {
      addLog(`🏆 ¡${enemy.name} derrotado!`);
      onWin({ ...gameState, playerHp: php, gold: gld + enemy.gold, totalTurns: turns + 1 });
      return;
    }

    // ── Regeneración jugador ─────────────────────────────────────────────────
    if (existRegen > 0) {
      php = Math.min(gameState.playerMaxHp, php + 4);
      setPlayerHp(php);
      existRegen--;
      addFloat(`+4 🌿`, "#33dd77", false);
      addLog(`🌿 Regeneración: +4 HP (${existRegen} turnos restantes)`);
      await delay(300);
    }
    setRegenTurns(pendingRegen > 0 ? pendingRegen : existRegen);

    // ── Ataque enemigo ───────────────────────────────────────────────────────
    const rawAtk = enemy.attack;
    if (refl) {
      ehp = Math.max(0, ehp - rawAtk);
      setEnemyHp(ehp);
      setReflect(false);
      addFloat(`↩️ −${rawAtk}`, t.primary, true);
      addLog(`↩️ Reflejo: ${rawAtk} daño devuelto a ${enemy.name}`);
    } else {
      const absorbed = Math.min(blk, rawAtk);
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

    setPlayerBlock(0);
    setTurns(prev => prev + 1);

    // ── Derrota ──────────────────────────────────────────────────────────────
    if (php <= 0) {
      addLog("💀 Has sido derrotado...");
      onLose({ ...gameState, playerHp: 0, totalTurns: turns + 1 });
      return;
    }
    if (ehp <= 0) {
      addLog(`🏆 ¡${enemy.name} derrotado!`);
      onWin({ ...gameState, playerHp: php, gold: gld + enemy.gold, totalTurns: turns + 1 });
      return;
    }

    setPhase("roll");
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const floorBoxes = Array.from({ length: 4 }, (_, i) => (
    <div key={i} style={{
      width: 14, height: 14,
      background: i <= gameState.floor ? t.primary : t.surface2,
      border: `1px solid ${t.border}`,
      borderRadius: 3,
    }} />
  ));

  const playerPct = playerHp / gameState.playerMaxHp;
  const enemyPct = enemyHp / enemy.maxHp;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: t.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: t.bodyFont,
      color: t.text,
      animation: "fadeIn 0.35s ease-out",
    }}>
      {/* ── Floating damage texts ── */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: "absolute",
          top: "35%",
          left: f.isEnemy ? "62%" : "28%",
          color: f.color,
          fontFamily: t.titleFont,
          fontSize: 20,
          fontWeight: "bold",
          pointerEvents: "none",
          animation: "floatUp 1.4s ease-out forwards",
          zIndex: 9000,
          textShadow: `0 0 8px ${f.color}`,
        }}>
          {f.text}
        </div>
      ))}

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px",
        background: t.surface1,
        borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 13 }}>
          {`NIVEL ${gameState.floor + 1}/4`}
          {" — "}
          <span style={{ color: t.text }}>{enemy.name}</span>
          {enemy.isBoss && <span style={{ color: t.accent, marginLeft: 8, fontSize: 11 }}>⚠ JEFE</span>}
        </div>
        <div style={{ display: "flex", gap: 4 }}>{floorBoxes}</div>
        <div style={{ fontFamily: t.titleFont, color: t.primary, fontSize: 13 }}>
          🪙 {gameState.gold}
        </div>
      </div>

      {/* ── Battle area ── */}
      <div style={{ display: "flex", flex: 1, gap: 8, padding: "12px 16px", minHeight: 0, overflow: "hidden" }}>

        {/* Player panel */}
        <div style={{
          width: 160, flexShrink: 0,
          background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
          padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: playerHitAnim ? "playerHit 0.4s ease-out" : undefined,
        }}>
          <div style={{ fontSize: 52 }}>🧙</div>
          <div style={{ fontFamily: t.titleFont, fontSize: 11, color: t.primary, textAlign: "center", letterSpacing: 1 }}>
            OPERADOR
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: t.textDim }}>HP</span>
              <span>{playerHp}/{gameState.playerMaxHp}</span>
            </div>
            <div style={{ background: t.hpBg, borderRadius: 4, height: 8, width: "100%" }}>
              <div style={{
                width: `${playerPct * 100}%`,
                height: "100%",
                background: hpBarColor(playerPct, t.hpColor),
                borderRadius: 4,
                transition: "width 0.3s",
              }} />
            </div>
          </div>
          {playerBlock > 0 && (
            <div style={{ fontSize: 12, color: t.accent2 }}>
              🛡️ {playerBlock === 9999 ? "∞" : playerBlock}
            </div>
          )}
          {reflect && <div style={{ fontSize: 12, color: t.accent2 }}>🔄 Reflejo</div>}
          {regenTurns > 0 && (
            <div style={{ fontSize: 12, color: "#33dd77" }}>🌿 Regen ({regenTurns})</div>
          )}
        </div>

        {/* Battle log */}
        <div style={{
          flex: 1,
          background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
          padding: "10px 12px",
          overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {log.map((msg, i) => (
            <div key={i} style={{
              fontSize: 12,
              color: i === log.length - 1 ? t.text : t.textDim,
              fontFamily: t.bodyFont,
              lineHeight: 1.4,
            }}>
              {msg}
            </div>
          ))}
        </div>

        {/* Enemy panel */}
        <div style={{
          width: 160, flexShrink: 0,
          background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 2,
          padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: enemyHit ? "enemyHit 0.4s ease-out" : undefined,
        }}>
          <div style={{ fontSize: 52 }}>
            {["🫧", "🗿", "🧙‍♂️", "🐉"][Math.min(gameState.floor, 3)]}
          </div>
          <div style={{ fontFamily: t.titleFont, fontSize: 11, color: t.accent, textAlign: "center", letterSpacing: 1 }}>
            {enemy.name}
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: t.textDim }}>HP</span>
              <span>{enemyHp}/{enemy.maxHp}</span>
            </div>
            <div style={{ background: t.hpBg, borderRadius: 4, height: 8, width: "100%" }}>
              <div style={{
                width: `${enemyPct * 100}%`,
                height: "100%",
                background: hpBarColor(enemyPct, t.hpColor),
                borderRadius: 4,
                transition: "width 0.3s",
              }} />
            </div>
          </div>
          <div style={{ fontSize: 12, color: t.textDim }}>⚔️ {enemy.attack} atk/turno</div>
          {poisonTurns > 0 && (
            <div style={{ fontSize: 12, color: "#aa44ff" }}>☠️ Veneno ({poisonTurns})</div>
          )}
        </div>
      </div>

      {/* ── Dice section ── */}
      <div style={{
        padding: "10px 16px",
        background: t.surface1, borderTop: `1px solid ${t.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <div style={{ fontFamily: t.titleFont, fontSize: 12, color: t.textDim, letterSpacing: 1 }}>
          DICE POOL
        </div>

        <div style={{ display: "flex", gap: 8, flex: 1 }}>
          {dice.map((die, i) => {
            const isSelected = die.selected;
            const isUsed = die.used;
            return (
              <div
                key={i}
                onClick={() => selectDie(i)}
                style={{
                  cursor: isUsed || phase !== "assign" ? "default" : "pointer",
                  opacity: isUsed ? 0.3 : 1,
                  transform: isSelected ? "scale(1.12) translateY(-4px)" : undefined,
                  transition: "transform 0.15s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}
              >
                <svg width="42" height="42" viewBox="0 0 48 48">
                  <rect x="2" y="2" width="44" height="44" rx="8"
                    fill={t.cardBg}
                    stroke={isSelected ? t.primary : (isUsed ? "#555" : t.border)}
                    strokeWidth={isSelected ? 3.5 : 1.5}
                    style={isSelected ? { filter: `drop-shadow(0 0 6px ${t.primary})` } : undefined}
                  />
                  {(DOT_POS[die.value] ?? []).map(([cx, cy], di) => (
                    <circle key={di} cx={cx} cy={cy} r={4} fill={t.diceColor} />
                  ))}
                </svg>
                <span style={{ fontSize: 11, color: t.textDim }}>{die.value}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          {phase === "assign" && (
            <div style={{ fontSize: 11, color: t.textDim }}>
              {selectedVal !== null ? `[${selectedVal}] seleccionado` : "SELECCIONA DADO"}
            </div>
          )}
          {phase === "roll" && (
            <button
              onClick={rollDice}
              style={{
                padding: "8px 20px",
                background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
                borderRadius: 2,
                color: t.text, fontFamily: t.titleFont, fontSize: 13,
                letterSpacing: 2, cursor: "pointer",
              }}
            >
              ▶ LANZAR
            </button>
          )}
          {phase === "assign" && (
            <button
              onClick={endTurn}
              style={{
                padding: "8px 20px",
                background: t.buttonBg, border: `1px solid ${t.buttonBorder}`,
                borderRadius: 2,
                color: t.text, fontFamily: t.titleFont, fontSize: 13,
                letterSpacing: 2, cursor: "pointer",
              }}
            >
              {`FIN TURNO [${hand.filter(c => c.activated).length}]`}
            </button>
          )}
          {phase === "resolving" && (
            <div style={{
              padding: "8px 20px",
              color: t.textDim, fontFamily: t.titleFont, fontSize: 13,
              animation: "pulse 1s infinite",
            }}>
              PROCESANDO...
            </div>
          )}
        </div>
      </div>

      {/* ── Card row ── */}
      <div style={{
        padding: "8px 16px",
        borderTop: `1px solid ${t.border}`,
        display: "flex", gap: 8, overflowX: "auto", flexShrink: 0,
        background: t.bg,
      }}>
        {hand.map((card, ci) => {
          const typeColor = t.cardTypeColors[card.type];
          const isCompatible = selectedVal !== null && checkRequirement(card.req, selectedVal) && !card.activated;
          const isActivated = card.activated;
          const isDimmed = selectedVal !== null && !isCompatible && !isActivated;

          return (
            <div
              key={ci}
              onClick={() => activateCard(ci)}
              style={{
                minWidth: 100, maxWidth: 100,
                background: t.cardBg,
                border: `1.5px solid ${isActivated ? typeColor : (isCompatible ? t.primary : t.border)}`,
                borderRadius: 2,
                padding: "8px 6px",
                cursor: phase === "assign" && isCompatible ? "pointer" : "default",
                opacity: isDimmed ? 0.38 : 1,
                transform: isActivated
                  ? "translateY(-10px) scale(1.04)"
                  : (isCompatible ? "translateY(-3px)" : undefined),
                transition: "transform 0.15s, opacity 0.15s",
                boxShadow: isActivated ? `0 0 12px ${typeColor}66` : undefined,
                display: "flex", flexDirection: "column", gap: 4, flexShrink: 0,
              }}
            >
              <div style={{ height: 4, background: typeColor, borderRadius: 2 }} />
              <div style={{
                fontSize: 9, color: typeColor, fontFamily: t.titleFont,
                letterSpacing: 1, textAlign: "center",
              }}>
                {reqLabel(card.req)}
              </div>
              <div style={{ fontSize: 16, textAlign: "center" }}>{card.icon}</div>
              <div style={{ fontSize: 10, color: t.text, fontFamily: t.titleFont, textAlign: "center", lineHeight: 1.2 }}>
                {card.name}
              </div>
              <div style={{ fontSize: 9, color: t.textDim, textAlign: "center", lineHeight: 1.3 }}>
                {card.desc}
              </div>
              {isActivated && (
                <div style={{ textAlign: "center", fontSize: 9, color: typeColor }}>
                  🎲 {card.assignedDie} ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
