"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/data";
import {
  getCurrentUser,
  setCurrentUser,
  findUserByEmail,
  getUserById,
  registerUser,
} from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "traveler" | "host";
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      const stored = getCurrentUser();
      if (!stored) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const freshUser = await getUserById(stored.id);
        const nextUser = freshUser ?? stored;
        setCurrentUser(nextUser);
        if (mounted) {
          setUser(nextUser);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function refreshUser() {
    const stored = getCurrentUser();
    if (!stored) {
      setUser(null);
      return;
    }

    const freshUser = await getUserById(stored.id);
    const nextUser = freshUser ?? stored;
    setCurrentUser(nextUser);
    setUser(nextUser);
  }

  async function login(email: string, password: string): Promise<User> {
    const found = await findUserByEmail(email);
    if (!found) throw new Error("No account found with this email.");
    if (found.password !== password) throw new Error("Incorrect password. Please try again.");
    setCurrentUser(found);
    setUser(found);
    return found;
  }

  async function signup(data: SignupData): Promise<User> {
    const newUser = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    });
    setCurrentUser(newUser);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    setCurrentUser(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
