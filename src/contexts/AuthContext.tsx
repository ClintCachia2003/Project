"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "tradepro_token";
const USER_KEY = "tradepro_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore from localStorage immediately (no flicker)
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        clearStorage();
      }
    }
    // Then validate with the server
    refreshUser(savedToken || undefined).finally(() => setLoading(false));
  }, []);

  function clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function saveToStorage(t: string, u: User) {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  async function refreshUser(t?: string) {
    const useToken = t || localStorage.getItem(TOKEN_KEY);
    if (!useToken) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${useToken}` },
      });
      if (res.ok) {
        const { user: u } = await res.json();
        setUser(u);
        setToken(useToken);
        saveToStorage(useToken, u);
      } else {
        setUser(null);
        setToken(null);
        clearStorage();
      }
    } catch {
      // Network error — keep existing local state
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invalid email or password");

    saveToStorage(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(data: RegisterData) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Registration failed");

    saveToStorage(json.token, json.user);
    setToken(json.token);
    setUser(json.user);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearStorage();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
