import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';

interface AuthUser { id: string; username: string; email: string; role: string; tenant_id: string; }
interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null, token: null,
  login: async () => {}, logout: () => {}, loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cx_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cx_token');
    const storedUser = localStorage.getItem('cx_user');
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.auth.login(username, password);
    const u: AuthUser = {
      id: res.user_id, username: res.username, role: res.role,
      email: `${res.username}@cipherx.sec`, tenant_id: res.tenant_id,
    };
    localStorage.setItem('cx_token', res.access_token);
    localStorage.setItem('cx_user', JSON.stringify(u));
    setToken(res.access_token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('cx_token');
    localStorage.removeItem('cx_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
