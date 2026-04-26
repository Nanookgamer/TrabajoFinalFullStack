/**
 * Eventos aleatorios que aparecen en el piso 2 (fase "event").
 *
 * EventPage selecciona uno al azar al montar el componente.
 * Cada evento tiene dos opciones con efectos distintos:
 *   - gold:   añade oro al jugador.
 *   - damage: resta HP al jugador.
 *   - heal:   restaura HP al jugador.
 *   - cost + card: gasta oro y otorga una carta aleatoria del SHOP_POOL.
 */
import type { GameEvent } from "../types";

export const EVENTS: GameEvent[] = [
  {
    id: "mercader",
    icon: "🧙",
    title: "Mercader Misterioso",
    desc: "Un comerciante encapuchado aparece de la nada y te ofrece monedas a cambio de información sobre el camino.",
    choices: [
      {
        text: "Aceptar el trato",
        effect: { gold: 8 },
        result: "¡Recibes 8 monedas de oro!",
      },
      {
        text: "Ignorarlo y seguir",
        effect: {},
        result: "Sigues tu camino sin novedades.",
      },
    ],
  },
  {
    id: "trampa",
    icon: "⚙️",
    title: "Trampa Mecánica",
    desc: "El suelo cede bajo tus pies. Una trampa mecánica bloquea el paso.",
    choices: [
      {
        text: "Esquivar rápido (−5 HP)",
        effect: { damage: 5 },
        result: "Esquivas... pero te lastimas. −5 HP.",
      },
      {
        text: "Forzar el paso (−12 HP)",
        effect: { damage: 12 },
        result: "Lo atraviesas a la fuerza. −12 HP.",
      },
    ],
  },
  {
    id: "altar",
    icon: "⛩️",
    title: "Altar Ancestral",
    desc: "Un altar antiguo pulsa con energía. Promete poder a cambio de un sacrificio.",
    choices: [
      {
        text: "Sacrificar 8 monedas",
        effect: { cost: 8, card: true },
        result: "¡El altar te otorga una carta nueva!",
      },
      {
        text: "Ignorar el altar",
        effect: {},
        result: "Continúas sin tocar nada.",
      },
    ],
  },
  {
    id: "campamento",
    icon: "🏕️",
    title: "Campamento Seguro",
    desc: "Encuentras un pequeño refugio con suministros. Puedes descansar un momento.",
    choices: [
      {
        text: "Descansar (+15 HP)",
        effect: { heal: 15 },
        result: "¡Recuperas 15 HP!",
      },
      {
        text: "Seguir adelante",
        effect: {},
        result: "Decides no perder tiempo.",
      },
    ],
  },
];
