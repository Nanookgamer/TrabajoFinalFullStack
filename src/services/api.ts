import type { GameState, User } from "../types";

// En dev Vite hace proxy /api → :3001. En producción es mismo origen.
const BASE = import.meta.env.VITE_API_URL ?? "";

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("dt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Error en la petición");
  }
  return res.json() as Promise<T>;
}

// ── Autenticación ─────────────────────────────────────────────────────────────

export const apiLogin = (username: string, password: string) =>
  request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const apiRegister = (username: string, password: string) =>
  request<{ token: string; user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// ── Partidas guardadas (3 slots por usuario) ──────────────────────────────────

export type SavedSlot = { slot: number; data: GameState | null };

// Devuelve los 3 slots del usuario. Si el servidor no está disponible,
// cae en localStorage con la clave dt_save_<slot>.
export const apiGetSaves = async (): Promise<SavedSlot[]> => {
  try {
    return await request<SavedSlot[]>("/api/save");
  } catch {
    return [1, 2, 3].map(slot => {
      const raw = localStorage.getItem(`dt_save_${slot}`);
      return { slot, data: raw ? (JSON.parse(raw) as GameState) : null };
    });
  }
};

// Guarda la partida en el slot indicado (localStorage + servidor).
export const apiSave = async (state: GameState, slot: number): Promise<void> => {
  localStorage.setItem(`dt_save_${slot}`, JSON.stringify(state));
  try {
    await request<void>(`/api/save/${slot}`, {
      method: "POST",
      body: JSON.stringify(state),
    });
  } catch { /* sin backend: localStorage es suficiente */ }
};

// Elimina el slot indicado de localStorage y del servidor.
export const apiDeleteSave = async (slot: number): Promise<void> => {
  localStorage.removeItem(`dt_save_${slot}`);
  try {
    await request<void>(`/api/save/${slot}`, { method: "DELETE" });
  } catch { /* sin backend */ }
};
