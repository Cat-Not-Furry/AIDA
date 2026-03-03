"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // supabase not configured; nothing to do
      setLoading(false);
      return;
    }

    // check initial session
    (async () => {
      const { data }: any = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    })();

    const listener = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  async function signUp(email: string, password: string) {
    if (!supabase) throw new Error("Supabase client not initialized");
    setLoading(true);
    const { error }: any = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    if (!supabase) throw new Error("Supabase client not initialized");
    setLoading(true);
    const { error }: any = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    if (!supabase) throw new Error("Supabase client not initialized");
    setLoading(true);
    const { error }: any = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
