"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Session {
  email: string;
  name: string;
  premium: boolean;
  premiumUntil?: string | null;  // ISO date — access valid until this date
  premiumPlan?: string | null;   // "monthly" | "yearly"
  cancelled?: boolean;           // true if user cancelled (but still in paid period)
  userId?: string;               // Supabase user ID (present when using real auth)
}

const SESSION_KEY = "cleverli_session"; // legacy localStorage fallback

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Track when a login is in progress so we don't misinterpret SIGNED_OUT from switching accounts
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    if (!supabase) {
      // No Supabase client (env vars missing) — fall back to localStorage only
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        setSession(raw ? JSON.parse(raw) : null);
      } catch { setSession(null); }
      setLoaded(true);
      return;
    }

    // 1. Try Supabase session first (wrapped in try-catch — expired/invalid tokens must not crash the app)
    supabase.auth.getSession().then(async ({ data: { session: sbSession } }) => {
      try {
        if (sbSession?.user) {
          const { data: profile } = await supabase!
            .from("parent_profiles")
            .select("name, premium, premium_until, premium_plan, cancelled")
            .eq("id", sbSession.user.id)
            .single();

          const sess: Session = {
            email: sbSession.user.email ?? "",
            name: profile?.name ?? sbSession.user.user_metadata?.name ?? "",
            premium: profile?.premium ?? false,
            premiumUntil: profile?.premium_until ?? null,
            premiumPlan: profile?.premium_plan ?? null,
            cancelled: profile?.cancelled ?? false,
            userId: sbSession.user.id,
          };
          setSession(sess);
          localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        } else {
          // 2. No Supabase session — fall back to localStorage cache
          // (handles token refresh delays, spurious sign-outs, legacy users)
          try {
            const raw = localStorage.getItem(SESSION_KEY);
            setSession(raw ? JSON.parse(raw) : null);
          } catch { setSession(null); }
        }
      } catch {
        // Auth error (expired token, network issue) — fall back to localStorage cache
        try {
          const raw = localStorage.getItem(SESSION_KEY);
          setSession(raw ? JSON.parse(raw) : null);
        } catch { setSession(null); }
      }
      setLoaded(true);
    }).catch(() => {
      // Unhandled rejection (e.g., Supabase unavailable) — degrade gracefully
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        setSession(raw ? JSON.parse(raw) : null);
      } catch { setSession(null); }
      setLoaded(true);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sbSession) => {
        try {
        if (sbSession?.user) {
          const { data: profile } = await supabase!
            .from("parent_profiles")
            .select("name, premium, premium_until, premium_plan, cancelled")
            .eq("id", sbSession.user.id)
            .single();

          const sess: Session = {
            email: sbSession.user.email ?? "",
            name: profile?.name ?? sbSession.user.user_metadata?.name ?? "",
            premium: profile?.premium ?? false,
            premiumUntil: profile?.premium_until ?? null,
            premiumPlan: profile?.premium_plan ?? null,
            cancelled: profile?.cancelled ?? false,
            userId: sbSession.user.id,
          };
          setSession(sess);
          localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        } else if (event === "SIGNED_OUT") {
          // Supabase v2 fires spurious SIGNED_OUT on reload/tab-switch AND when
          // switching accounts via signInWithPassword. Be conservative:
          // Only clear if there is genuinely no cached session AND we're not in
          // the middle of a new login attempt.
          const cached = localStorage.getItem(SESSION_KEY);
          if (!cached) {
            setSession(null);
          }
          // Note: logout() is the only path that removes SESSION_KEY from localStorage.
          // loginInProgress flag prevents misreading account-switch SIGNED_OUTs.
        }
        } catch {
          // Auth state change error — ignore, keep current session state
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  // isPremium: true only if premium=true AND not expired (premium_until > now, or no expiry set)
  const isPremium = (() => {
    if (!session?.premium) return false;
    if (!session.premiumUntil) return true; // no expiry date = permanent / not yet set
    return new Date(session.premiumUntil) > new Date();
  })();

  return { session, loaded, isPremium, logout, setLoginInProgress };
}
