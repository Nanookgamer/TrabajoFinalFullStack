import type { GameState, User } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('dt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? 'Error en la petición');
  }
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const apiLogin = (username: string, password: string) =>
  request<{ token: string; user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const apiRegister = (username: string, password: string) =>
  request<{ token: string; user: User }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

// ── Partida guardada ──────────────────────────────────────────────────────────
// El backend almacena: floor, deck (IDs), diceCount, hp, maxHp, gold, totalTurns
// Una sola partida por usuario (UNIQUE user_id en la tabla saved_games)

export const apiGetSave = async (): Promise<GameState | null> => {
  try {
    return await request<GameState | null>('/api/save');
  } catch {
    const local = localStorage.getItem('dt_save');
    return local ? (JSON.parse(local) as GameState) : null;
  }
};

export const apiSave = async (state: GameState): Promise<void> => {
  localStorage.setItem('dt_save', JSON.stringify(state));
  try {
    await request<void>('/api/save', {
      method: 'POST',
      body: JSON.stringify(state),
    });
  } catch { /* sin backend: guardado solo en localStorage */ }
};

export const apiDeleteSave = async (): Promise<void> => {
  localStorage.removeItem('dt_save');
  try {
    await request<void>('/api/save', { method: 'DELETE' });
  } catch { /* sin backend */ }
};
