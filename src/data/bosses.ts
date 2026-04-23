import type { Enemy } from '../types';

export const BOSSES: Enemy[] = [
  {
    id: 'dragon',
    name: 'Dragón de Circuitos',
    maxHp: 92,
    attack: 14,
    gold: 30,
    desc: 'El señor supremo de la mazmorra. Su aliento destruye mundos',
    tier: 4,
    isBoss: true,
  },
  {
    id: 'lich',
    name: 'Lich Digital',
    maxHp: 80,
    attack: 18,
    gold: 35,
    desc: 'Conciencia arcana atrapada en un servidor eterno. Inmortal hasta que destruyas su núcleo',
    tier: 4,
    isBoss: true,
  },
  {
    id: 'cyber_queen',
    name: 'Reina Cyber',
    maxHp: 110,
    attack: 11,
    gold: 40,
    desc: 'Soberana de la red oscura. Cada turno invoca protocolos defensivos imprevisibles',
    tier: 4,
    isBoss: true,
  },
];

export const FINAL_BOSS = BOSSES[0];
