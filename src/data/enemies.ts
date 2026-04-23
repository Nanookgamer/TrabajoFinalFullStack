import type { Enemy } from '../types';

export const ENEMIES: Enemy[] = [
  {
    id: 'slime',
    name: 'Slime Mecánico',
    maxHp: 24,
    attack: 4,
    gold: 7,
    desc: 'Una masa de metal líquido y código corrupto',
    tier: 1,
  },
  {
    id: 'golem',
    name: 'Golem de Datos',
    maxHp: 42,
    attack: 7,
    gold: 12,
    desc: 'Construido con fragmentos de código antiguo y acero fundido',
    tier: 2,
  },
  {
    id: 'brujo',
    name: 'Brujo Cibernético',
    maxHp: 58,
    attack: 10,
    gold: 18,
    desc: 'Magia arcana y circuitos cuánticos fusionados en un ser eterno',
    tier: 3,
  },
];
