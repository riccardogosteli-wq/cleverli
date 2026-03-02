"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";

export default function Login() {
  const { tr } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setNotice("Bitte E-Mail und Passwort eingeben."); return; }
    setLoading(true);
    setNotice("");
    // Auth coming soon — for now redirect to dashboard after brief delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <CleverliMascot size={90} />
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{tr("login")}</h1>
          <p className="text-sm text-gray-400 mt-1">Willkommen zurück!</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-3">
          {notice && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
              {notice}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={tr("emailPlaceholder")}
            autoComplete="email"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white text-base transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={tr("passwordPlaceholder")}
            autoComplete="current-password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white text-base transition-colors"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 text-base"
          >
            {loading ? "Wird geladen..." : tr("login")}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">oder</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => { setLoading(true); setTimeout(() => router.push("/dashboard"), 600); }}
            className="w-full border-2 border-gray-200 bg-white py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>🔵</span> Weiter mit Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          {tr("noAccount")}{" "}
          <Link href="/signup" className="text-green-600 font-semibold hover:underline">{tr("signup")}</Link>
        </p>

        <p className="text-center text-xs text-gray-400">
          Direkt ausprobieren?{" "}
          <Link href="/dashboard" className="text-green-600 underline">Ohne Anmeldung starten →</Link>
        </p>
      </div>
    </div>
  );
}
