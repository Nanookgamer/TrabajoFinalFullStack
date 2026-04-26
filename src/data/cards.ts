/**
 * Datos estáticos de todas las cartas del juego.
 *
 * CARDS        — diccionario completo de las 15 cartas, indexado por ID.
 * STARTER_DECK — IDs de las cartas con las que empieza una partida nueva.
 * SHOP_POOL    — IDs de las cartas disponibles en la tienda (excluye las del mazo inicial).
 *
 * checkRequirement() — comprueba si un valor de dado activa una carta.
 * cardPrice()        — calcula el precio de una carta en la tienda (base por tipo + aleatoriedad).
 */
import type { Card } from "../types";

export const CARDS: Record<string, Card> = {
  golpe_basico: {
    id: "golpe_basico",
    name: "Golpe Básico",
    icon: "⚡",
    type: "attack",
    req: { type: "even" },
    reqLabel: "PAR",
    effect: { damage: 4 },
    desc: "Descarga que inflige 4 de daño",
  },
  ataque_preciso: {
    id: "ataque_preciso",
    name: "Ataque Preciso",
    icon: "🎯",
    type: "attack",
    req: { type: "exact", value: 4 },
    reqLabel: "= 4",
    effect: { damage: 7 },
    desc: "Golpe calculado al milímetro. 7 de daño",
  },
  furia: {
    id: "furia",
    name: "Furia",
    icon: "💥",
    type: "attack",
    req: { type: "exact", value: 6 },
    reqLabel: "= 6",
    effect: { damage: 12 },
    desc: "Potencia al límite. 12 de daño masivo",
  },
  doble_golpe: {
    id: "doble_golpe",
    name: "Doble Golpe",
    icon: "⚔️",
    type: "attack",
    req: { type: "range", min: 3, max: 6 },
    reqLabel: "3 – 6",
    effect: { damage: 4, hits: 2 },
    desc: "Dos impactos rápidos de 4 cada uno",
  },
  electro: {
    id: "electro",
    name: "Electro",
    icon: "🌩️",
    type: "attack",
    req: { type: "even" },
    reqLabel: "PAR",
    effect: { damage: 7 },
    desc: "Pulso eléctrico devastador. 7 de daño",
  },
  explosion: {
    id: "explosion",
    name: "Explosión",
    icon: "💣",
    type: "attack",
    req: { type: "range", min: 5, max: 6 },
    reqLabel: "5 – 6",
    effect: { damage: 14 },
    desc: "Payload explosivo. 14 de daño total",
  },
  veneno: {
    id: "veneno",
    name: "Veneno",
    icon: "🧪",
    type: "attack",
    req: { type: "range", min: 4, max: 5 },
    reqLabel: "4 – 5",
    effect: { damage: 2, dot: { dmg: 2, turns: 3 } },
    desc: "2 daño + veneno (2/turno × 3)",
  },
  escudo: {
    id: "escudo",
    name: "Escudo",
    icon: "🛡️",
    type: "defense",
    req: { type: "odd" },
    reqLabel: "IMPAR",
    effect: { block: 6 },
    desc: "Barrera activa. Bloquea 6 de daño",
  },
  barrera: {
    id: "barrera",
    name: "Barrera",
    icon: "🏰",
    type: "defense",
    req: { type: "exact", value: 1 },
    reqLabel: "= 1",
    effect: { block: 16 },
    desc: "Barrera maciza. Absorbe 16 de daño",
  },
  escudo_magico: {
    id: "escudo_magico",
    name: "Escudo Mágico",
    icon: "✨",
    type: "defense",
    req: { type: "exact", value: 3 },
    reqLabel: "= 3",
    effect: { block: 9999 },
    desc: "Campo de fuerza. Bloquea TODO el daño",
  },
  contraataque: {
    id: "contraataque",
    name: "Contraataque",
    icon: "🔄",
    type: "defense",
    req: { type: "exact", value: 5 },
    reqLabel: "= 5",
    effect: { reflect: true },
    desc: "Devuelve el próximo ataque al remitente",
  },
  curacion: {
    id: "curacion",
    name: "Curación",
    icon: "💚",
    type: "heal",
    req: { type: "range", min: 1, max: 3 },
    reqLabel: "1 – 3",
    effect: { heal: 6 },
    desc: "Restaura los sistemas. +6 HP",
  },
  gran_curacion: {
    id: "gran_curacion",
    name: "Gran Curación",
    icon: "💊",
    type: "heal",
    req: { type: "exact", value: 2 },
    reqLabel: "= 2",
    effect: { heal: 14 },
    desc: "Restauración completa. +14 HP",
  },
  regeneracion: {
    id: "regeneracion",
    name: "Regeneración",
    icon: "🌿",
    type: "heal",
    req: { type: "exact", value: 1 },
    reqLabel: "= 1",
    effect: { regen: { hp: 4, turns: 3 } },
    desc: "Regeneración activa. +4 HP/turno × 3",
  },
  pickpocket: {
    id: "pickpocket",
    name: "Pickpocket",
    icon: "💰",
    type: "utility",
    req: { type: "odd" },
    reqLabel: "IMPAR",
    effect: { gold: 6 },
    desc: "Roba 6 monedas de oro al enemigo",
  },
};

export const STARTER_DECK: string[] = [
  "golpe_basico",
  "escudo",
  "curacion",
  "ataque_preciso",
  "doble_golpe",
];

export const SHOP_POOL: string[] = [
  "furia",
  "gran_curacion",
  "veneno",
  "explosion",
  "contraataque",
  "electro",
  "escudo_magico",
  "regeneracion",
  "doble_golpe",
  "barrera",
  "pickpocket",
];

// Devuelve true si el valor del dado cumple el requisito de activación de la carta
export function checkRequirement(req: Card["req"], dieValue: number): boolean {
  switch (req.type) {
    case "even":  return dieValue % 2 === 0;
    case "odd":   return dieValue % 2 !== 0;
    case "exact": return dieValue === req.value;
    case "range": return dieValue >= req.min && dieValue <= req.max;
  }
}

// Precio base por tipo + ±4 de variación aleatoria para que la tienda se sienta diferente en cada visita
export function cardPrice(card: Card): number {
  const base: Record<string, number> = { attack: 8, defense: 7, heal: 9, utility: 6 };
  return (base[card.type] ?? 8) + Math.floor(Math.random() * 5);
}
