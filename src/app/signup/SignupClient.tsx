"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { getSupabase } from "@/lib/supabase";

export default function Signup() {
  const { tr } = useLang();
  const router = useRouter();
  const { session, loaded } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (loaded && session) router.replace("/dashboard");
  }, [loaded, session, router]);

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

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase not available");

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: email.split("@")[0] } },
      });

      if (signupError) {
        if (signupError.message.includes("already registered")) {
          setError(tr("errorEmailExists") ?? "Diese E-Mail ist bereits registriert. Bitte melde dich an.");
        } else {
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

      setSuccess(true);

      // If session is immediately available (email confirm disabled), redirect to first exercise
      if (data?.session) {
        setTimeout(() => router.push("/learn/1/math/zahlen-1-10"), 800);
      } else {
        // Email confirmation required — stay on success screen
      }
    } catch (err: unknown) {
      setLoading(false);
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
              <p className="text-sm text-gray-500">Kostenlos · keine Kreditkarte nötig</p>
            </div>

            <form onSubmit={handleSignup} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input
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
                <label className="block text-sm font-medium text-gray-700">Passwort</label>
                <input
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

              <button
                type="submit"
                disabled={loading || !email.trim() || password.length < 6}
                style={{ minHeight: "48px" }}
                className="w-full bg-green-700 text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-green-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "⏳ Konto wird erstellt..." : "🎉 Kostenlos starten"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Mit Signup stimmst du unseren{" "}
                <Link href="/datenschutz" className="text-green-700 underline">Datenschutzbestimmungen</Link> zu
              </p>
            </form>

            <p className="text-center text-sm text-gray-600">
              Bereits ein Konto?{" "}
              <Link href="/login" className="text-green-700 font-semibold hover:underline">Anmelden</Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 space-y-4 text-center">
            <div className="text-4xl">✨</div>
            <h2 className="text-xl font-bold text-gray-900">Konto erstellt!</h2>
            <p className="text-sm text-gray-600">
              Dein Konto ist bereit. Du wirst zum ersten Kurs weitergeleitet...
            </p>
            <p className="text-xs text-gray-400">Einen Moment bitte ⏳</p>
          </div>
        )}
      </div>
    </div>
  );
}
