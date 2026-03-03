"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Session {
  email: string;
  name: string;
  premium: boolean;
  userId?: string; // Supabase user ID (present when using real auth)
}

const SESSION_KEY = "cleverli_session"; // legacy localStorage fallback

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Try Supabase session first
    supabase.auth.getSession().then(async ({ data: { session: sbSession } }) => {
      if (sbSession?.user) {
        // Fetch premium status from parent_profiles
        const { data: profile } = await supabase
          .from("parent_profiles")
          .select("name, premium")
          .eq("id", sbSession.user.id)
          .single();

        const sess: Session = {
          email: sbSession.user.email ?? "",
          name: profile?.name ?? sbSession.user.user_metadata?.name ?? "",
          premium: profile?.premium ?? false,
          userId: sbSession.user.id,
        };
        setSession(sess);
        // Keep localStorage in sync for backwards compat
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      } else {
        // 2. Fall back to localStorage session (existing users)
        try {
          const raw = localStorage.getItem(SESSION_KEY);
          setSession(raw ? JSON.parse(raw) : null);
        } catch { setSession(null); }
      }
      setLoaded(true);
    });

    // Listen for Supabase auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sbSession) => {
        if (sbSession?.user) {
          const { data: profile } = await supabase
            .from("parent_profiles")
            .select("name, premium")
            .eq("id", sbSession.user.id)
            .single();

          const sess: Session = {
            email: sbSession.user.email ?? "",
            name: profile?.name ?? sbSession.user.user_metadata?.name ?? "",
            premium: profile?.premium ?? false,
            userId: sbSession.user.id,
          };
          setSession(sess);
          localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          localStorage.removeItem(SESSION_KEY);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return { session, loaded, isPremium: session?.premium ?? false, logout };
}
