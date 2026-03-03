"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { tr } = useLang();
  const router = useRouter();
  const { session, loaded } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UJ-3: redirect if already logged in
  useEffect(() => {
    if (loaded && session) router.replace("/dashboard");
  }, [loaded, session, router]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Bitte E-Mail und Passwort eingeben."); return; }
    setLoading(true);
    setError("");

    if (!supabase) { setError("Auth nicht verfügbar. Bitte später versuchen."); setLoading(false); return; }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setLoading(false);
      if (authError.message.includes("Invalid login")) {
        setError("E-Mail oder Passwort falsch.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Bitte bestätige zuerst deine E-Mail-Adresse.");
      } else {
        setError(authError.message);
      }
    }
    // on success, onAuthStateChange in useSession handles redirect via session update
    // router.push happens after session is set
  };

  // Redirect once session is set after login
  useEffect(() => {
    if (loaded && session) router.push("/dashboard");
  }, [session]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <CleverliMascot size={90} />
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{tr("login")}</h1>
          <p className="text-sm text-gray-400 mt-1">Willkommen zurück!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="deine@email.ch"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60">
            {loading ? "Anmelden…" : tr("login")}
          </button>

          <div className="flex flex-col gap-1.5 items-center pt-1">
            <Link href="/reset-password" className="text-xs text-gray-400 hover:text-gray-600 underline">
              Passwort vergessen?
            </Link>
            <Link href="/signup" className="text-xs text-green-600 underline">
              Noch kein Konto? Jetzt registrieren →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
