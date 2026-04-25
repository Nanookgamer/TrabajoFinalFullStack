/**
 * Contexto de autenticación de la aplicación.
 *
 * AuthProvider envuelve la app y expone a todos los componentes hijos:
 *   - user:     datos del usuario autenticado (o null si no hay sesión).
 *   - token:    JWT del usuario (o null).
 *   - login:    inicia sesión y persiste el token en localStorage.
 *   - register: crea una cuenta nueva y persiste el token.
 *   - logout:   cierra la sesión y limpia localStorage.
 *
 * Persistencia: el token y los datos del usuario se guardan en localStorage
 * con las claves "dt_token" y "dt_user" para sobrevivir recargas de página.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { apiLogin, apiRegister } from "../services/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Valor inicial null — useAuth lanza un error si se usa fuera de AuthProvider
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Recupera la sesión guardada al montar el componente (recarga de página)
  useEffect(() => {
    const savedToken = localStorage.getItem("dt_token");
    const savedUser  = localStorage.getItem("dt_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Llama a la API de login y persiste las credenciales en localStorage
  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("dt_token", data.token);
    localStorage.setItem("dt_user", JSON.stringify(data.user));
  };

  // Llama a la API de registro y persiste las credenciales en localStorage
  const register = async (username: string, password: string) => {
    const data = await apiRegister(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("dt_token", data.token);
    localStorage.setItem("dt_user", JSON.stringify(data.user));
  };

  // Elimina el token y los datos del usuario tanto del estado como del almacenamiento local
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("dt_token");
    localStorage.removeItem("dt_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de acceso al contexto — lanza un error descriptivo si se usa fuera de AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
