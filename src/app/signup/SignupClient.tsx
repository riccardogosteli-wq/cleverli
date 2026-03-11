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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // UJ-3: redirect if already logged in
  useEffect(() => {
    if (loaded && session) router.replace("/dashboard");
  }, [loaded, session, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email
    if (!email.includes("@")) {
      setError(tr("errorEmailInvalid") ?? "Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase not available");
      
      // Auto-generate password from email (user doesn't need to enter it)
      const autoPassword = email.split("@")[0] + Math.random().toString(36).slice(2, 10);
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password: autoPassword,
        options: { data: { name: email.split("@")[0] } },
      });

      if (signupError) {
        if (signupError.message.includes("already registered")) {
          setError(tr("errorEmailExists") ?? "Diese E-Mail ist bereits registriert. Melde dich an.");
        } else {
          setError(signupError.message);
        }
        setLoading(false);
        return;
      }

      // Store onboarding flags
      localStorage.setItem("cleverli_new_user", "true");
      localStorage.setItem("cleverli_profile_created", "false"); // Will prompt to create profile
      localStorage.setItem("cleverli_session", JSON.stringify({ email, premium: false }));
      
      // Clear anonymous tracking (they're now signed up)
      localStorage.removeItem("cleverli_anon_exercises");
      localStorage.removeItem("cleverli_signup_dismissed");
      
      // Send welcome email (fire & forget)
      fetch("/api/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email.split("@")[0] }),
      }).catch(() => {});

      setSuccess(true);

      // Redirect directly to first exercise (Grade 1 Math - Zahlen bis 10)
      setTimeout(() => {
        router.push("/learn/1/math/zahlen-bis-10");
      }, 1000);
    } catch (err: unknown) {
      setLoading(false);
      // Fallback: if Supabase fails, use localStorage auth
      localStorage.setItem("cleverli_session", JSON.stringify({ email, premium: false }));
      localStorage.setItem("cleverli_new_user", "true");
      localStorage.removeItem("cleverli_anon_exercises");
      localStorage.removeItem("cleverli_signup_dismissed");
      console.error("Signup error:", err);
      
      // Still redirect to exercise even if signup fails
      setTimeout(() => {
        router.push("/learn/1/math/zahlen-bis-10");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">

        {/* Mascot */}
        <div className="text-center">
          <CleverliMascot size={100} mood={success ? "celebrate" : "happy"} />
        </div>

        {/* Form */}
        {!success ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Jetzt starten</h1>
              <p className="text-sm text-gray-500">Kostenlos - keine Kreditkarte nötig</p>
            </div>

            <form onSubmit={handleSignup} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deine E-Mail</label>
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
                <p className="text-xs text-gray-400">Wir schicken dir einen Bestätigungslink</p>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{ minHeight: "48px" }}
                className="w-full bg-green-700 text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-green-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "⏳ Account wird erstellt..." : "🎉 Kostenlos testen"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Mit Signup stimmst du unseren{" "}
                <Link href="/datenschutz" className="text-green-700 underline">Datenschutzbestimmungen</Link> zu
              </p>
            </form>

            <p className="text-center text-sm text-gray-600">
              Hast du bereits ein Konto?{" "}
              <Link href="/login" className="text-green-700 font-semibold hover:underline">Melde dich an</Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 space-y-4 text-center">
            <div className="text-4xl">✨</div>
            <h2 className="text-xl font-bold text-gray-900">Geschafft!</h2>
            <p className="text-sm text-gray-600">
              Dein Konto ist bereit. Wir leiten dich zum ersten Kurs weiter...
            </p>
            <p className="text-xs text-gray-400">Einen Moment bitte ⏳</p>
          </div>
        )}
      </div>
    </div>
  );
}
