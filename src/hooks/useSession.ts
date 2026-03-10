"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

export interface Session {
  email: string;
  name: string;
  premium: boolean;
  premiumUntil?: string | null;  // ISO date — access valid until this date
  premiumPlan?: string | null;   // "monthly" | "yearly"
  cancelled?: boolean;           // true if user cancelled (but still in paid period)
  userId?: string;               // Supabase user ID (present when using real auth)
}

const SESSION_KEY = "cleverli_session"; // localStorage cache key

// ── Sync read from localStorage — used for instant initial state ─────────────
function readCachedSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function useSession() {
  // ✅ INSTANT init from localStorage cache — eliminates "Anmelden" flash on reload
  // Supabase will verify & update in the background; UI shows correct state immediately.
  const [session, setSession] = useState<Session | null>(readCachedSession);

  // ✅ loaded = true immediately if we have a cached session; false if guest (need Supabase check)
  const [loaded, setLoaded] = useState<boolean>(() => !!readCachedSession());

  // useRef so the auth state change callback always reads the current value (not stale closure)
  const loginInProgressRef = useRef(false);
  const setLoginInProgress = (v: boolean) => { loginInProgressRef.current = v; };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // No Supabase client — localStorage-only mode
      const cached = readCachedSession();
      setSession(cached);
      setLoaded(true);
      return;
    }

    // Background verification: confirm Supabase token is still valid and refresh profile data
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
          // No valid Supabase session — use cache or clear
          const cached = readCachedSession();
          if (!cached) setSession(null); // genuinely logged out
          // If cached exists: keep showing it (handles transient Supabase issues)
        }
      } catch {
        // Auth error — keep current state (cache still valid)
      }
      setLoaded(true);
    }).catch(() => {
      // Supabase unreachable — fall back to cache
      setLoaded(true);
    });

    // Listen for auth state changes (login, token refresh, sign-out)
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
            setLoaded(true);
          } else if (event === "SIGNED_OUT") {
            // Only clear if there's no cached session AND logout() removed it.
            // Supabase v2 fires spurious SIGNED_OUT on reload/tab-switch.
            // logout() removes SESSION_KEY first, then signOut() fires this event.
            const cached = localStorage.getItem(SESSION_KEY);
            if (!cached) {
              setSession(null);
              setLoaded(true);
            }
          }
        } catch {
          // Auth state change error — ignore, keep current session
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    // Remove cache BEFORE signOut so the SIGNED_OUT listener sees no cache and clears state
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
  };

  // isPremium: true only if premium=true AND not expired
  const isPremium = (() => {
    if (!session?.premium) return false;
    if (!session.premiumUntil) return true;
    return new Date(session.premiumUntil) > new Date();
  })();

  return { session, loaded, isPremium, logout, setLoginInProgress };
}
