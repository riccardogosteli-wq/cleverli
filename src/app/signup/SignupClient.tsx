"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { getSupabase } from "@/lib/supabase";
import { trackSignUp, trackSignupStarted } from "@/lib/analytics";
import { captureAppError } from "@/lib/monitoring";
import { getCheckoutAuthUrl, getPendingCheckoutIntent, startCheckout } from "@/lib/checkoutClient";
import { trackUserActivity } from "@/lib/userActivityClient";
import { readAdsExperimentAttribution } from "@/lib/adsAbVariant";
import { getAnonymousSessionId, getStoredAttribution } from "@/lib/attribution";

export default function Signup() {
  const { tr } = useLang();
  const router = useRouter();
  const { session, loaded } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<ReturnType<typeof getPendingCheckoutIntent>>(null);
  const [intentLoaded, setIntentLoaded] = useState(false);
  const isPendingTrial = pendingCheckout?.trialDays === 7;
  const pendingPlanLabel = pendingCheckout?.plan === "monthly"
    ? "danach CHF 9.90/Monat"
    : pendingCheckout?.plan === "yearly"
      ? "danach CHF 99/Jahr"
      : pendingCheckout?.plan === "schooltime"
        ? "einmalig CHF 249"
        : "";

  useEffect(() => {
    setPendingCheckout(getPendingCheckoutIntent());
    setIntentLoaded(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loaded || !intentLoaded || !session) return;
    if (pendingCheckout) {
      startCheckout(pendingCheckout.plan, pendingCheckout.source, session.userId, {
        trialDays: pendingCheckout.trialDays,
        experimentAttribution: pendingCheckout.experimentAttribution,
      });
      return;
    }
    router.replace("/dashboard");
  }, [loaded, intentLoaded, session, pendingCheckout, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError(tr("errorEmailInvalid") ?? "Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError(tr("passwordMin6") ?? "Passwort muss mindestens 6 Zeichen haben.");
      setLoading(false);
      return;
    }
    if (!privacyAccepted) {
      setError("Bitte akzeptiere die Datenschutzbestimmungen.");
      setLoading(false);
      return;
    }

    void trackSignupStarted();

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase not available");
      const experimentAttribution = pendingCheckout?.experimentAttribution ?? readAdsExperimentAttribution();
      const attribution = getStoredAttribution();
      const privacyPolicyAcceptedAt = new Date().toISOString();

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split("@")[0],
            attribution,
            privacy_policy_accepted: true,
            privacy_policy_accepted_at: privacyPolicyAcceptedAt,
            privacy_policy_version: "2026-09-05",
            ...(experimentAttribution
              ? {
                  ads_ab_experiment: experimentAttribution.experiment,
                  ads_ab_variant: experimentAttribution.variant,
                  ads_ab_visitor_id: experimentAttribution.visitorId,
                  ads_ab_page: experimentAttribution.page,
                  ads_ab_internal_qa: experimentAttribution.internalQa,
                  ads_ab_forced: experimentAttribution.forcedVariant,
                }
              : {}),
          },
        },
      });

      if (signupError) {
        if (signupError.message.includes("already registered")) {
          setError(tr("errorEmailExists") ?? "Diese E-Mail ist bereits registriert. Bitte melde dich an.");
        } else {
          captureAppError(signupError, { area: "signup" });
          setError(signupError.message);
        }
        setLoading(false);
        return;
      }

      // Store onboarding flags
      localStorage.setItem("cleverli_new_user", "true");
      localStorage.setItem("cleverli_new_user_since", Date.now().toString());
      localStorage.setItem("cleverli_session", JSON.stringify({ email, premium: false }));

      // Clear anonymous tracking
      localStorage.removeItem("cleverli_anon_exercises");
      localStorage.removeItem("cleverli_signup_dismissed");

      // Send welcome email (fire & forget)
      const lang = localStorage.getItem("cleverli_lang") ?? "de";
      fetch("/api/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email.split("@")[0], lang }),
      }).catch(() => {});

      trackSignUp("email");
      trackUserActivity("signup", {
        email,
        accessToken: data.session?.access_token,
        metadata: {
          pendingCheckout: pendingCheckout?.plan ?? null,
          anonymous_session_id: getAnonymousSessionId(),
          attribution,
          privacy_policy_accepted: true,
          privacy_policy_accepted_at: privacyPolicyAcceptedAt,
          privacy_policy_version: "2026-09-05",
          ...(experimentAttribution
            ? {
                experiment: experimentAttribution.experiment,
                variant: experimentAttribution.variant,
                experiment_visitor_id: experimentAttribution.visitorId,
                experiment_page: experimentAttribution.page,
                internal_qa: experimentAttribution.internalQa,
                forced_variant: experimentAttribution.forcedVariant,
              }
            : {}),
        },
      });
      setSuccess(true);

      // If session is immediately available (email confirm disabled), redirect to first exercise
      if (data?.session) {
        if (pendingCheckout) {
          setTimeout(() => startCheckout(pendingCheckout.plan, pendingCheckout.source, data.session?.user.id, {
            trialDays: pendingCheckout.trialDays,
            experimentAttribution: pendingCheckout.experimentAttribution,
          }), 800);
          return;
        }
        setTimeout(() => router.push("/learn/1/math/zahlen-1-10"), 800);
      } else {
        // Email confirmation required — stay on success screen
      }
    } catch (err: unknown) {
      setLoading(false);
      captureAppError(err, { area: "signup" });
      console.error("Signup error:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuche es nochmal.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">

        {/* Mascot */}
        <div className="text-center">
          <CleverliMascot size={100} mood={success ? "celebrate" : "happy"} />
        </div>

        {!success ? (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Konto erstellen</h1>
              <p className="text-sm text-gray-500">
                {isPendingTrial ? "7 Tage Premium testen · heute CHF 0" : pendingCheckout ? "Konto erstellen, dann sicher bezahlen" : "Kostenlos · keine Kreditkarte nötig"}
              </p>
            </div>

            <form onSubmit={handleSignup} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  ⚠️ {error}
                </div>
              )}

              {isPendingTrial && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <p className="font-bold">Premium bleibt 7 Tage kostenlos.</p>
                  <p className="mt-1 text-xs leading-5">
                    Alle Übungen, alle Klassen und bis zu 3 Kinderprofile. {pendingPlanLabel ? `${pendingPlanLabel}, vorher jederzeit kündbar.` : "Vorher jederzeit kündbar."}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="deine@email.ch"
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={loading}
                  style={{ fontSize: "16px" }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Passwort</label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Mindestens 6 Zeichen"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  style={{ fontSize: "16px" }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white transition-colors disabled:opacity-50"
                />
                <p className="text-xs text-gray-400">Merke dir dein Passwort — du brauchst es zum Einloggen</p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={e => { setPrivacyAccepted(e.target.checked); setError(""); }}
                  required
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600 disabled:opacity-50"
                />
                <span>
                  Ich akzeptiere die{" "}
                  <Link href="/datenschutz" className="font-semibold text-green-700 underline">Datenschutzbestimmungen</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !email.trim() || password.length < 6 || !privacyAccepted}
                style={{ minHeight: "48px" }}
                className="w-full bg-green-700 text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-green-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "⏳ Konto wird erstellt..." : isPendingTrial ? "Konto erstellen & 7 Tage testen" : pendingCheckout ? "Weiter zur sicheren Zahlung" : "🎉 Kostenlos starten"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Bereits ein Konto?{" "}
              <Link
                href={pendingCheckout ? getCheckoutAuthUrl("/login", pendingCheckout.plan, pendingCheckout.source, {
                  trialDays: pendingCheckout.trialDays,
                  experimentAttribution: pendingCheckout.experimentAttribution,
                }) : "/login"}
                className="text-green-700 font-semibold hover:underline"
              >
                Anmelden
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 space-y-4 text-center">
            <div className="text-4xl">✨</div>
            <h2 className="text-xl font-bold text-gray-900">Konto erstellt!</h2>
            <p className="text-sm text-gray-600">
              {pendingCheckout ? "Dein Konto ist bereit. Du wirst zur sicheren Zahlung weitergeleitet..." : "Dein Konto ist bereit. Du wirst zum ersten Kurs weitergeleitet..."}
            </p>
            <p className="text-xs text-gray-400">Einen Moment bitte ⏳</p>
          </div>
        )}
      </div>
    </div>
  );
}
