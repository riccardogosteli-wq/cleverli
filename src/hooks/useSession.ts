"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { restoreFamilyFromSupabase } from "@/lib/progressSync";
import { clearLocalFamilyStateOnLogout } from "@/lib/accountScopedStorage";

export interface Session {
  email: string;
  name: string;
  premium: boolean;
  premiumUntil?: string | null;  // ISO date — access valid until this date
  premiumPlan?: string | null;   // "monthly" | "yearly" | "schooltime"
  cancelled?: boolean;           // true if user cancelled (but still in paid period)
  userId?: string;               // Supabase user ID (present when using real auth)
}

const SESSION_KEY = "cleverli_session"; // localStorage cache key
const PREMIUM_CHECK_TIMEOUT_MS = 5_000;

function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = PREMIUM_CHECK_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("Premium check timed out")), timeoutMs);
    Promise.resolve(promise)
      .then(resolve, reject)
      .finally(() => window.clearTimeout(timer));
  });
}

// ── Sync read from localStorage — used for instant initial state ─────────────
function readCachedSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function isSessionPremiumActive(session: Session | null) {
  if (!session?.premium) return false;
  if (!session.premiumUntil) return true;
  const premiumUntil = new Date(session.premiumUntil);
  return !Number.isNaN(premiumUntil.getTime()) && premiumUntil > new Date();
}

async function refreshLocalFamily() {
  try {
    await restoreFamilyFromSupabase();
  } catch {
    // Progress sync is best-effort; auth must still complete if restore fails.
  }
}

export function useSession() {
  // ✅ INSTANT init from localStorage cache — eliminates "Anmelden" flash on reload
  // Must start as null on server (SSR), then hydrate from localStorage on client only.
  // This prevents React hydration mismatch (#418) caused by server/client HTML divergence.
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [premiumVerified, setPremiumVerified] = useState<boolean>(false);
  const [premiumChecked, setPremiumChecked] = useState<boolean>(false);

  // useRef so the auth state change callback always reads the current value (not stale closure)
  const loginInProgressRef = useRef(false);
  const setLoginInProgress = (v: boolean) => { loginInProgressRef.current = v; };

  // ── Hydrate from localStorage on client mount (after SSR) ──────────────────
  useEffect(() => {
    const cached = readCachedSession();
    if (cached) {
      setSession(cached);
      if (isSessionPremiumActive(cached)) {
        setPremiumVerified(true);
        setPremiumChecked(true);
      }
      setLoaded(true);
      refreshLocalFamily();
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    const applyCachedFallback = () => {
      const cached = readCachedSession();
      if (cached) {
        setSession(cached);
        setPremiumVerified(isSessionPremiumActive(cached));
      } else {
        setPremiumVerified(false);
      }
      setPremiumChecked(true);
      setLoaded(true);
    };

    if (!supabase) {
      // No Supabase client — keep cached identity and active Premium during
      // transient client/env failures, but never extend expired Premium.
      applyCachedFallback();
      return;
    }

    // Background verification: confirm Supabase token is still valid and refresh profile data
    withTimeout(supabase.auth.getSession()).then(async ({ data: { session: sbSession } }) => {
      try {
        if (sbSession?.user) {
          const { data: profile, error: profileError } = await withTimeout(supabase!
            .from("parent_profiles")
            .select("name, premium, premium_until, premium_plan, cancelled")
            .eq("id", sbSession.user.id)
            .single());
          if (profileError) throw profileError;

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
          setPremiumVerified(true);
          setPremiumChecked(true);
          refreshLocalFamily();
        } else {
          // Supabase is configured and reachable, but there is no valid auth
          // session. Clear stale cached sessions so old premium=false data does
          // not keep showing a half-logged-in account forever.
          localStorage.removeItem(SESSION_KEY);
          setSession(null);
          setPremiumVerified(false);
          setPremiumChecked(true);
        }
      } catch {
        // Profile read failed/timeouts can happen after mobile app switches.
        // Keep already cached active Premium instead of interrupting learning.
        applyCachedFallback();
      }
      setLoaded(true);
    }).catch(() => {
      // Supabase unreachable — keep cached active Premium, then verify again on
      // the next auth/focus cycle. Free/expired users stay locked.
      applyCachedFallback();
    });

    // Listen for auth state changes (login, token refresh, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sbSession) => {
        try {
          if (sbSession?.user) {
            const { data: profile, error: profileError } = await withTimeout(supabase!
              .from("parent_profiles")
              .select("name, premium, premium_until, premium_plan, cancelled")
              .eq("id", sbSession.user.id)
              .single());
            if (profileError) throw profileError;

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
            setPremiumVerified(true);
            setPremiumChecked(true);
            refreshLocalFamily();
            setLoaded(true);
          } else if (event === "SIGNED_OUT") {
            // Only clear if there's no cached session AND logout() removed it.
            // Supabase v2 fires spurious SIGNED_OUT on reload/tab-switch.
            // logout() removes SESSION_KEY first, then signOut() fires this event.
            const cached = localStorage.getItem(SESSION_KEY);
            if (!cached) {
              setSession(null);
              setPremiumVerified(false);
              setPremiumChecked(true);
              setLoaded(true);
            }
          }
        } catch {
          // Auth state change/profile read failed — keep cached active Premium
          // so a mobile app switch does not show the paywall mid-exercise.
          applyCachedFallback();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    // Remove cache BEFORE signOut so the SIGNED_OUT listener sees no cache and clears state
    localStorage.removeItem(SESSION_KEY);
    clearLocalFamilyStateOnLogout();
    setSession(null);
    setPremiumVerified(false);
    setPremiumChecked(true);
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
  };

  // isPremium: true only if premium=true AND not expired
  const isPremium = (() => {
    if (!premiumVerified) return false;
    if (!session?.premium) return false;
    if (!session.premiumUntil) return true;
    return new Date(session.premiumUntil) > new Date();
  })();

  return { session, loaded, isPremium, premiumChecked, logout, setLoginInProgress };
}
