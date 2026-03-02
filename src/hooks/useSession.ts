"use client";
import { useState, useEffect } from "react";

export interface Session {
  email: string;
  name: string;
  premium: boolean;
}

const SESSION_KEY = "cleverli_session";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      setSession(raw ? JSON.parse(raw) : null);
    } catch { setSession(null); }
    setLoaded(true);
  }, []);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return { session, loaded, isPremium: session?.premium ?? false, logout };
}
