"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";


export default function Signup() {
  const { tr } = useLang();
  const router = useRouter();
  const { session, loaded } = useSession();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"parent" | "child" | null>(null);
  const setRoleAndStore = (r: "parent" | "child") => { setRole(r); localStorage.setItem("cleverli_role", r); };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateStep2 = () => {
    if (!name.trim()) { setError(tr("errorNameRequired") ?? "Bitte gib deinen Namen ein."); return false; }
    if (!email.includes("@") || !email.includes(".")) { setError(tr("errorEmailInvalid") ?? "Bitte gib eine gültige E-Mail-Adresse ein."); return false; }
    if (password.length < 6) { setError(tr("passwordMin6") ?? "Das Passwort muss mindestens 6 Zeichen lang sein."); return false; }
    return true;
  };

  // UJ-3: redirect if already logged in
  useEffect(() => {
    if (loaded && session) router.replace("/dashboard");
  }, [loaded, session, router]);

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      if (!supabase) throw new Error("Supabase not available");
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (signupError) {
        setLoading(false);
        if (signupError.message.includes("already registered")) {
          setError(tr("errorEmailExists") ?? "Diese E-Mail ist bereits registriert.");
        } else {
          setError(signupError.message);
        }
        return;
      }

      // Store grade + onboarding flags
      localStorage.setItem("cleverli_last_grade", String(grade));
      localStorage.setItem("cleverli_new_user", "true");

      // If session is available immediately (email confirm off), go to dashboard
      if (data?.session) {
        router.push("/dashboard");
      } else {
        // Fallback: store minimal session in localStorage and proceed
        localStorage.setItem("cleverli_session", JSON.stringify({ email, name, premium: false }));
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setLoading(false);
      // Fallback: if Supabase fails entirely, use localStorage auth
      localStorage.setItem("cleverli_session", JSON.stringify({ email, name, premium: false }));
      localStorage.setItem("cleverli_last_grade", String(grade));
      localStorage.setItem("cleverli_new_user", "true");
      console.error("Supabase signup error:", err);
      router.push("/dashboard");
    }
  };

  const inputCls = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white transition-colors";

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-6 px-4 pb-16">
      <div className="w-full max-w-sm space-y-5">

        {/* Mascot */}
        <div className="text-center">
          <CleverliMascot size={85} mood={step === 3 ? "celebrate" : step === 2 ? "sit-read" : "happy"} />
        </div>

        {/* Stepper with labels */}
        <div className="flex justify-center items-start gap-2">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all mx-auto
                ${step > s ? "bg-green-600 border-green-600 text-white" :
                  step === s ? "bg-green-600 border-green-600 text-white ring-4 ring-green-100" :
                  "bg-white border-gray-300 text-gray-400"}`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`text-[10px] text-center leading-tight ${step === s ? "text-green-700 font-semibold" : "text-gray-400"}`}>
                {s === 1 ? tr("whoAreYou") ?? "Wer bist du?" : s === 2 ? tr("yourAccount") ?? "Dein Konto" : tr("yourClass") ?? "Deine Klasse"}
              </span>
            </div>
          ))}
        </div>

        {/* ── Step 1: Role ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 text-center">Wer bist du?</h1>
            <div className="grid grid-cols-2 gap-3">
              {([
                { r: "parent", emoji: "👨‍👩‍👧", label: tr("iAmParent") },
                { r: "child",  emoji: "🧒",     label: tr("iAmChild") },
              ] as const).map(({ r, emoji, label }) => (
                <button key={r} onClick={() => { setRole(r); setStep(2); setError(""); }}
                  style={{ minHeight: "110px" }}
                  className="bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 active:scale-95 rounded-2xl p-5 text-center font-semibold text-gray-800 transition-all">
                  <div className="text-4xl mb-2">{emoji}</div>
                  <div className="text-sm">{label}</div>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 pt-1">
              Nur ausprobieren?{" "}
              <Link href="/dashboard" className="text-green-600 underline">Direkt starten →</Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Account ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 text-center">
              {role === "parent" ? "Elternteil-Konto erstellen" : "Dein Konto erstellen"}
            </h1>
            {role === "child" && (
              <p className="text-xs text-center text-gray-400 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                💡 Bitte einen Elternteil um Hilfe beim Erstellen des Kontos.
              </p>
            )}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                placeholder={role === "parent" ? "Vorname Elternteil" : "Dein Vorname"}
                autoComplete="given-name"
                style={{ fontSize: "16px" }}
                className={inputCls}
              />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder={tr("emailPlaceholder")}
                autoComplete="email"
                inputMode="email"
                style={{ fontSize: "16px" }}
                className={inputCls}
              />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder={tr("passwordPlaceholder") + " (min. 6)"}
                autoComplete="new-password"
                style={{ fontSize: "16px" }}
                className={inputCls}
              />
              <button
                onClick={() => { if (validateStep2()) { setError(""); setStep(3); } }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all text-base"
              >
                Weiter →
              </button>
            </div>
            <button onClick={() => { setStep(1); setError(""); }}
              className="block mx-auto text-sm text-gray-400 hover:text-gray-600 py-2">
              ← Zurück
            </button>
          </div>
        )}

        {/* ── Step 3: Grade ── */}
        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 text-center">
              {role === "parent"
                ? tr("whichClassChild") ?? "Welche Klasse besucht dein Kind?"
                : tr("whichClass")}
            </h1>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(g => (
                <button key={g} onClick={() => setGrade(g)}
                  style={{ minHeight: "72px" }}
                  className={`border-2 rounded-2xl font-bold text-lg active:scale-95 transition-all ${
                    grade === g
                      ? "border-green-600 bg-green-600 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-800 hover:border-green-400 hover:bg-green-50"}`}>
                  <div className="text-2xl">{g}.</div>
                  <div className="text-xs font-medium opacity-80">{tr("gradeLabel")}</div>
                </button>
              ))}
            </div>

            {grade && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-3 text-center text-sm text-green-800 font-medium">
                🎉 Super! Du startest in der {grade}. Klasse.
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!grade || loading}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Wird geladen..." : "🎉 Los geht's!"}
            </button>

            <button onClick={() => setStep(2)}
              className="block mx-auto text-sm text-gray-400 hover:text-gray-600 py-2">
              ← Zurück
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          {tr("alreadyHave")}{" "}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">{tr("login")}</Link>
        </p>
      </div>
    </div>
  );
}
