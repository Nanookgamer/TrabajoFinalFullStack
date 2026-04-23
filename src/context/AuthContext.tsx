import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { apiLogin, apiRegister } from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('dt_token');
    const savedUser = localStorage.getItem('dt_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('dt_token', data.token);
    localStorage.setItem('dt_user', JSON.stringify(data.user));
  };

  const register = async (username: string, password: string) => {
    const data = await apiRegister(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('dt_token', data.token);
    localStorage.setItem('dt_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dt_token');
    localStorage.removeItem('dt_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
