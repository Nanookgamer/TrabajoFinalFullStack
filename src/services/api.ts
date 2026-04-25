/**
 * Cliente HTTP para la API del servidor de Dice Tactics.
 *
 * La URL base se configura con la variable de entorno VITE_API_URL.
 * Si no está definida, apunta a http://localhost:3000 (desarrollo local).
 *
 * Todos los endpoints de partida guardada tienen un fallback a localStorage
 * ("dt_save") para que el juego funcione sin servidor backend.
 *
 * Endpoints disponibles:
 *   POST   /api/auth/login    → { token, user }
 *   POST   /api/auth/register → { token, user }
 *   GET    /api/save          → GameState | null
 *   POST   /api/save          → guarda el estado actual
 *   DELETE /api/save          → elimina la partida guardada
 */
import type { GameState, User } from "../types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Construye el header de autorización a partir del token almacenado en localStorage
function authHeader(): Record<string, string> {
  const token = localStorage.getItem("dt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Función genérica de petición HTTP con manejo de errores y cabeceras comunes
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

// ── Partida guardada ──────────────────────────────────────────────────────────

// Obtiene la partida del servidor; si falla, intenta con el localStorage
export const apiGetSave = async (): Promise<GameState | null> => {
  try {
    return await request<GameState | null>("/api/save");
  } catch {
    const local = localStorage.getItem("dt_save");
    return local ? (JSON.parse(local) as GameState) : null;
  }
};

// Guarda el estado en localStorage primero (rápido) y luego en el servidor
export const apiSave = async (state: GameState): Promise<void> => {
  localStorage.setItem("dt_save", JSON.stringify(state));
  try {
    await request<void>("/api/save", {
      method: "POST",
      body: JSON.stringify(state),
    });
  } catch { /* sin backend: el guardado en localStorage es suficiente */ }
};

// Elimina la partida de localStorage y del servidor (al ganar o perder)
export const apiDeleteSave = async (): Promise<void> => {
  localStorage.removeItem("dt_save");
  try {
    await request<void>("/api/save", { method: "DELETE" });
  } catch { /* sin backend */ }
};
