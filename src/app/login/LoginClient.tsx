"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { getSupabase } from "@/lib/supabase";
import { getPendingCheckoutIntent, startCheckout } from "@/lib/checkoutClient";
import { trackUserActivity } from "@/lib/userActivityClient";

export default function Login() {
  const { tr } = useLang();
  const router = useRouter();
  const { session, loaded, setLoginInProgress } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<ReturnType<typeof getPendingCheckoutIntent>>(null);
  const [intentLoaded, setIntentLoaded] = useState(false);

  useEffect(() => {
    setPendingCheckout(getPendingCheckoutIntent());
    setIntentLoaded(true);
  }, []);

  // UJ-3: redirect if already logged in (also check localStorage synchronously to avoid flash)
  const [redirecting, setRedirecting] = useState(() => {
    if (typeof window !== "undefined") {
      try { return !getPendingCheckoutIntent() && !!localStorage.getItem("cleverli_session"); } catch { return false; }
    }
    return false;
  });

  useEffect(() => {
    if (loaded && intentLoaded && session) {
      if (pendingCheckout) {
        startCheckout(pendingCheckout.plan, pendingCheckout.source, session.userId);
        return;
      }
      setRedirecting(true);
      router.replace("/dashboard");
    }
  }, [loaded, intentLoaded, session, pendingCheckout, router]);

  const handleLogin = async () => {
    if (!email || !password) { setError(tr("errorEmailPw") ?? "Bitte E-Mail und Passwort eingeben."); return; }
    setLoading(true);
    setError("");
    setLoginInProgress(true); // tell useSession to ignore spurious SIGNED_OUT during login

    const supabase = getSupabase();
    if (!supabase) { setError(tr("errorAuthUnavail") ?? "Auth nicht verfügbar."); setLoading(false); return; }
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setLoading(false);
      setLoginInProgress(false);
      if (authError.message.includes("Invalid login")) {
        setError(tr("errorWrongCredentials") ?? "E-Mail oder Passwort falsch.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError(tr("errorEmailNotConfirmed") ?? "Bitte bestätige zuerst deine E-Mail-Adresse.");
      } else {
        setError(authError.message);
      }
    } else {
      trackUserActivity("login", {
        email,
        accessToken: data.session?.access_token,
        metadata: { pendingCheckout: pendingCheckout?.plan ?? null },
      });
      // Success: reset loading state and force redirect
      setLoading(false);
      setLoginInProgress(false);
      if (pendingCheckout) {
        startCheckout(pendingCheckout.plan, pendingCheckout.source);
        return;
      }
      router.replace("/dashboard");
    }
    // on success, onAuthStateChange in useSession handles redirect via session update
    // router.push happens after session is set
  };

  // Redirect once session is set after login
  useEffect(() => {
    if (!loaded || !intentLoaded || !session) return;
    if (pendingCheckout) {
      startCheckout(pendingCheckout.plan, pendingCheckout.source, session.userId);
      return;
    }
    router.push("/dashboard");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pendingCheckout]);

  // Show loading spinner immediately if we know user is already logged in
  if (redirecting) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center space-y-3 text-gray-800 font-semibold">
          <div className="text-4xl animate-spin">⚙️</div>
          <div className="text-sm">Weiterleiten…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <CleverliMascot size={90} />
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{tr("login")}</h1>
          <p className="text-sm text-gray-800 font-semibold mt-1">{tr("welcomeBack")}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 font-semibold mb-1">{tr("emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="deine@email.ch"
              autoComplete="email"
              inputMode="email"
              style={{ fontSize: "16px" }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 font-semibold mb-1">{tr("passwordLabel")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ fontSize: "16px" }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                style={{ minHeight: "44px", minWidth: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60">
            {loading ? (tr("loggingIn") ?? "Anmelden…") : tr("login")}
          </button>

          <div className="flex flex-col gap-1.5 items-center pt-1">
            <Link href="/reset-password" className="text-xs text-gray-800 font-semibold hover:text-gray-800 underline">
              Passwort vergessen?
            </Link>
            <Link
              href={pendingCheckout ? `/signup?checkout=${pendingCheckout.plan}&source=${encodeURIComponent(pendingCheckout.source)}` : "/signup"}
              className="text-xs text-green-700 underline"
            >
              Noch kein Konto? Jetzt registrieren →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
